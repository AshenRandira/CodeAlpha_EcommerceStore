import { Link } from 'react-router';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/useCart.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Shopping cart
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your cart
            </h1>

            <p className="mt-3 text-slate-600">
              {itemCount === 1
                ? '1 item in your cart'
                : `${itemCount} items in your cart`}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="w-fit rounded-lg px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Clear cart
            </button>
          )}
        </div>

        {storageError && (
          <div
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800"
            role="alert"
          >
            {storageError}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Your cart is empty
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Ready to find something?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Browse the store and add products to your cart. Your cart will
              stay available when you refresh the page.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.productId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <Link
                      to={`/products/${item.productId}`}
                      className="aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-square"
                      aria-label={`View ${item.name}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </Link>

                    <div className="flex flex-col justify-between gap-6 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-lg font-bold tracking-tight text-slate-950 transition hover:text-blue-700"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-2 text-sm text-slate-500">
                            {item.stock} units available
                          </p>

                          <p className="mt-2 font-semibold text-slate-800">
                            {priceFormatter.format(item.price)} each
                          </p>
                        </div>

                        <p className="text-lg font-bold text-slate-950">
                          {priceFormatter.format(
                            item.price * item.quantity,
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-11 w-11 items-center justify-center rounded-l-xl text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
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
                            className="h-11 w-16 border-x border-slate-300 text-center font-semibold text-slate-900 outline-none"
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
                            className="flex h-11 w-11 items-center justify-center rounded-r-xl text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                  <span>Items</span>
                  <span className="font-semibold text-slate-900">
                    {itemCount}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-900">
                      Subtotal
                    </span>

                    <span className="text-2xl font-bold text-slate-950">
                      {priceFormatter.format(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Shipping details and order placement will be handled during
                    checkout.
                  </p>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Proceed to checkout
              </Link>

              <Link
                to="/"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default CartPage;
