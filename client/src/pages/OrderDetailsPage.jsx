import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router';
import {
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';
import {
  formatDate,
  lkrFormatter,
  longDateFormatter,
} from '../utils/format.js';

const STATUS_STYLES = {
  placed: 'bg-blue-50 text-blue-700',
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getItemCount(order) {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) =>
      total +
      (
        Number.isInteger(item.quantity)
          ? item.quantity
          : 0
      ),
    0,
  );
}

function getStatusClass(status) {
  return (
    STATUS_STYLES[status?.toLowerCase()] ??
    'bg-slate-100 text-slate-700'
  );
}

function OrderDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);

  const loadOrder = useCallback(
    async (signal) => {
      setIsLoading(true);
      setError('');
      setErrorStatus(null);

      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal,
          },
        );

        const data = await readJsonResponse(response);

        if (!response.ok) {
          setErrorStatus(response.status);

          throw new Error(
            data.message || 'Unable to load this order.',
          );
        }

        if (!data.order?._id) {
          throw new Error(
            'The order response was incomplete.',
          );
        }

        setOrder(data.order);
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }

        setError(
          requestError.message ||
            'Unable to load this order.',
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [id, token],
  );

  useEffect(() => {
    const controller = new AbortController();

    loadOrder(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadOrder]);

  function handleRetry() {
    loadOrder();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1">
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-600">
                Loading order details...
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    const isInvalidId = errorStatus === 400;
    const isMissing = errorStatus === 404;
    const isAccessDenied = errorStatus === 403;

    const title = isInvalidId
      ? 'Invalid order ID'
      : isMissing
        ? 'Order not found'
        : isAccessDenied
          ? 'Access denied'
          : 'Could not load this order';

    const description = isInvalidId
      ? 'The order address contains an invalid ID.'
      : isMissing
        ? 'The requested order does not exist.'
        : isAccessDenied
          ? 'This order belongs to another account.'
          : error;

    const canRetry =
      !isInvalidId &&
      !isMissing &&
      !isAccessDenied;

    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex flex-1 items-center">
          <section className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
            <div
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
              role="alert"
            >
              <h1 className="text-xl font-bold text-slate-900">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {canRetry && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Try again
                  </button>
                )}

                <Link
                  to="/orders"
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back to my orders
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const itemCount = getItemCount(order);
  const statusClass = getStatusClass(order.status);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            to="/orders"
            className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft
              size={15}
              aria-hidden="true"
            />
            Back to orders
          </Link>

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Order Details
              </h1>

              <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-500">
                {order._id}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-1.5 text-sm font-bold capitalize ${statusClass}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="space-y-5">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Items
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {itemCount === 1
                        ? '1 item in this order'
                        : `${itemCount} items in this order`}
                    </p>
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    {formatDate(
                      order.createdAt,
                      longDateFormatter,
                    )}
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <article
                      key={`${item.product}-${index}`}
                      className="py-5 first:pt-5 last:pb-0"
                    >
                      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 break-all text-xs leading-5 text-slate-400">
                            Product ID: {item.product}
                          </p>

                          <p className="mt-2 text-sm text-slate-600">
                            {lkrFormatter.format(item.price)}
                            {' x '}
                            {item.quantity}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-slate-500">
                            Line total
                          </p>

                          <p className="mt-1 text-base font-bold text-slate-900">
                            {lkrFormatter.format(
                              item.price * item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin
                    size={17}
                    className="text-blue-600"
                    aria-hidden="true"
                  />

                  <h2 className="text-base font-bold text-slate-900">
                    Shipping Address
                  </h2>
                </div>

                <address className="not-italic text-sm leading-7 text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {order.shippingAddress.fullName}
                  </p>

                  <p>
                    {order.shippingAddress.addressLine1}
                  </p>

                  <p>
                    {order.shippingAddress.city}
                    {' '}
                    {order.shippingAddress.postalCode}
                  </p>

                  <p>
                    {order.shippingAddress.country}
                  </p>
                </address>
              </section>
            </div>

            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-20">
              <h2 className="text-base font-bold text-slate-900">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Items
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {itemCount}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Status
                  </dt>

                  <dd
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusClass}`}
                  >
                    {order.status}
                  </dd>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-900">
                      Total
                    </dt>

                    <dd className="text-xl font-extrabold text-slate-900">
                      {lkrFormatter.format(order.subtotal)}
                    </dd>
                  </div>
                </div>
              </dl>

              <Link
                to="/orders"
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to my orders
              </Link>

              <Link
                to="/"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetailsPage;