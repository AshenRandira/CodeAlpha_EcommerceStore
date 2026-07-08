import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
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

function getOrderItemCount(order) {
  if (!Array.isArray(order.items)) {
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

function formatOrderDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return dateFormatter.format(date);
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
            data.message || 'Unable to load your orders.',
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
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Order history
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My orders
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review the orders saved to your account.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-700">
              Loading your orders...
            </p>
          </div>
        ) : error ? (
          <div
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6"
            role="alert"
          >
            <h2 className="text-lg font-bold text-red-900">
              We could not load your orders.
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              No orders yet
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Your order history is empty.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              Browse the store, add products to your cart, and complete checkout to create your first order.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const itemCount = getOrderItemCount(order);

              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Order
                      </p>

                      <p className="mt-1 break-all font-semibold text-slate-950">
                        {order._id}
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        Items
                      </p>

                      <p className="mt-1 font-bold text-slate-950">
                        {itemCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Subtotal
                      </p>

                      <p className="mt-1 font-bold text-slate-950">
                        {priceFormatter.format(order.subtotal)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default OrdersPage;