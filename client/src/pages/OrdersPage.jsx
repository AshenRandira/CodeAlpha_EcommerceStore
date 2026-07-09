import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router';
import {
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';
import {
  formatDate,
  lkrFormatter,
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

function OrdersPage() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(
    async (signal) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/orders/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        const data = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to load your orders.',
          );
        }

        if (!Array.isArray(data.orders)) {
          throw new Error(
            'The orders response was incomplete.',
          );
        }

        setOrders(data.orders);
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }

        setError(
          requestError.message ||
            'Unable to load your orders.',
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [token],
  );

  useEffect(() => {
    const controller = new AbortController();

    loadOrders(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadOrders]);

  function handleRetry() {
    loadOrders();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Review the orders saved to your account.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-600">
                Loading your orders...
              </p>
            </div>
          ) : error ? (
            <div
              className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm"
              role="alert"
            >
              <h2 className="text-base font-bold text-red-900">
                Could not load your orders
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-8">
              <ClipboardList
                size={40}
                strokeWidth={1.5}
                className="mx-auto text-slate-300"
                aria-hidden="true"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No orders yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete a checkout to see your order history here.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const itemCount = getItemCount(order);
                const statusClass =
                  getStatusClass(order.status);

                return (
                  <article
                    key={order._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Order
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold leading-5 text-slate-800">
                          {order._id}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                      <dl className="flex flex-wrap gap-8 text-sm">
                        <div>
                          <dt className="text-slate-500">
                            Items
                          </dt>

                          <dd className="mt-1 font-bold text-slate-900">
                            {itemCount}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-slate-500">
                            Total
                          </dt>

                          <dd className="mt-1 font-bold text-slate-900">
                            {lkrFormatter.format(
                              order.subtotal,
                            )}
                          </dd>
                        </div>
                      </dl>

                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex w-fit items-center gap-1 rounded-md text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View details

                        <ChevronRight
                          size={14}
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default OrdersPage;