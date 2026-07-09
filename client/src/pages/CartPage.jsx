import { Link } from 'react-router';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/useCart.js';
import { lkrFormatter } from '../utils/format.js';

function CartPage() {
  const {
    cartItems,
    itemCount,
    subtotal,
    storageError,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Your Cart
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {itemCount === 1
                  ? '1 item in your cart'
                  : `${itemCount} items in your cart`}
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2
                  size={14}
                  aria-hidden="true"
                />
                Clear cart
              </button>
            )}
          </div>

          {storageError && (
            <div
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-800"
              role="alert"
            >
              {storageError}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-8">
              <ShoppingBag
                size={40}
                strokeWidth={1.5}
                className="mx-auto text-slate-300"
                aria-hidden="true"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse the store and add products to your cart.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <article
                    key={item.productId}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="grid sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <Link
                        to={`/products/${item.productId}`}
                        className="group aspect-[4/3] overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:aspect-square"
                        aria-label={`View ${item.name}`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-col justify-between gap-4 p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <Link
                              to={`/products/${item.productId}`}
                              className="line-clamp-2 font-bold text-slate-900 transition hover:text-blue-600 focus:outline-none focus:text-blue-600"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-sm text-slate-500">
                              {lkrFormatter.format(item.price)} each
                            </p>
                          </div>

                          <p className="shrink-0 text-base font-extrabold text-slate-900">
                            {lkrFormatter.format(
                              item.price * item.quantity,
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-l-lg text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                            >
                              <Minus
                                size={14}
                                aria-hidden="true"
                              />
                            </button>

                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.quantity}
                              onChange={(event) =>
                                updateQuantity(
                                  item.productId,
                                  event.target.value,
                                )
                              }
                              className="h-9 w-12 border-x border-slate-200 text-center text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                              aria-label={`Quantity of ${item.name}`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              disabled={item.quantity >= item.stock}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-r-lg text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                            >
                              <Plus
                                size={14}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.productId)
                            }
                            className="flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <Trash2
                              size={14}
                              aria-hidden="true"
                            />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-20">
                <h2 className="text-lg font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 text-slate-600">
                    <span>
                      Items ({itemCount})
                    </span>

                    <span className="font-semibold text-slate-900">
                      {lkrFormatter.format(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-slate-600">
                    <span>
                      Shipping details
                    </span>

                    <span className="text-right font-semibold text-slate-900">
                      Added at checkout
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-900">
                      Subtotal
                    </span>

                    <span className="text-2xl font-extrabold text-slate-900">
                      {lkrFormatter.format(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Current product prices are verified by the
                    server when you place your order.
                  </p>
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/"
                  className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;