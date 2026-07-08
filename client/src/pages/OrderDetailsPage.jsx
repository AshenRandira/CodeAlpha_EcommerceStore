import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function formatOrderDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return dateFormatter.format(date);
}

function getOrderItemCount(order) {
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
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-700">
              Loading order details...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    const isInvalidId = errorStatus === 400;
    const isMissing = errorStatus === 404;
    const isAccessDenied = errorStatus === 403;

    const title =
      isInvalidId
        ? 'Invalid order ID'
        : isMissing
          ? 'Order not found'
          : isAccessDenied
            ? 'Access denied'
            : 'We could not load this order.';

    const description =
      isInvalidId
        ? 'The order address contains an invalid ID.'
        : isMissing
          ? 'The requested order does not exist.'
          : isAccessDenied
            ? 'This order belongs to another account.'
            : error;

    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <div
            className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
            role="alert"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
              Order details
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {!isInvalidId &&
                !isMissing &&
                !isAccessDenied && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Try again
                  </button>
                )}

              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Back to my orders
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const itemCount = getOrderItemCount(order);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Order details
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your order
            </h1>

            <p className="mt-3 break-all text-sm font-medium text-slate-500">
              {order._id}
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-700">
            {order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    Items
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {itemCount === 1
                      ? '1 item in this order'
                      : `${itemCount} items in this order`}
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>

              <div className="mt-6 divide-y divide-slate-200">
                {order.items.map((item, index) => (
                  <article
                    key={`${item.product}-${index}`}
                    className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {item.name}
                      </h3>

                      <p className="mt-2 break-all text-xs text-slate-400">
                        Product ID: {item.product}
                      </p>

                      <p className="mt-3 text-sm text-slate-600">
                        {priceFormatter.format(item.price)} each
                        {' - '}
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-medium text-slate-500">
                        Line total
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-950">
                        {priceFormatter.format(
                          item.price * item.quantity,
                        )}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Shipping address
              </h2>

              <address className="mt-5 not-italic leading-7 text-slate-600">
                <p className="font-semibold text-slate-950">
                  {order.shippingAddress.fullName}
                </p>

                <p>{order.shippingAddress.addressLine1}</p>

                <p>
                  {order.shippingAddress.city}
                  {' '}
                  {order.shippingAddress.postalCode}
                </p>

                <p>{order.shippingAddress.country}</p>
              </address>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-600">
                  Items
                </dt>

                <dd className="font-semibold text-slate-950">
                  {itemCount}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-600">
                  Status
                </dt>

                <dd className="font-semibold capitalize text-slate-950">
                  {order.status}
                </dd>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-semibold text-slate-900">
                    Subtotal
                  </dt>

                  <dd className="text-2xl font-bold text-slate-950">
                    {priceFormatter.format(order.subtotal)}
                  </dd>
                </div>
              </div>
            </dl>

            <Link
              to="/orders"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Back to my orders
            </Link>

            <Link
              to="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default OrderDetailsPage;
