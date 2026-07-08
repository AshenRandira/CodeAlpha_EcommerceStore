import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/useCart.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ProductDetailsPage() {
  const { id } = useParams();
  const {
    addToCart,
    cartItems,
  } = useCart();

  const [productState, setProductState] = useState({
    state: 'loading',
    product: null,
    error: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setProductState({
        state: 'loading',
        product: null,
        error: '',
      });
      setQuantity(1);
      setCartMessage('');

      try {
        const response = await fetch(`/api/products/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (response.status === 404) {
          setProductState({
            state: 'not-found',
            product: null,
            error: '',
          });

          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load this product.');
        }

        setProductState({
          state: 'success',
          product: data,
          error: '',
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setProductState({
          state: 'error',
          product: null,
          error: error.message,
        });
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  const product =
    productState.state === 'success'
      ? productState.product
      : null;

  const cartItem = product
    ? cartItems.find((item) => item.productId === product._id)
    : null;

  const quantityInCart = cartItem?.quantity ?? 0;

  const remainingStock = product
    ? Math.max(0, product.stock - quantityInCart)
    : 0;

  const canAddToCart =
    Boolean(product) &&
    product.stock > 0 &&
    remainingStock > 0;

  function handleQuantityChange(event) {
    const nextQuantity = Number(event.target.value);

    if (!Number.isFinite(nextQuantity) || remainingStock <= 0) {
      return;
    }

    setQuantity(
      Math.min(
        remainingStock,
        Math.max(1, Math.trunc(nextQuantity)),
      ),
    );
    setCartMessage('');
  }

  function decreaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    );
    setCartMessage('');
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(remainingStock, currentQuantity + 1),
    );
    setCartMessage('');
  }

  function handleAddToCart() {
    if (!product || !canAddToCart) {
      return;
    }

    const quantityToAdd = Math.min(quantity, remainingStock);
    const added = addToCart(product, quantityToAdd);

    if (!added) {
      setCartMessage('This product could not be added to your cart.');
      return;
    }

    setCartMessage(
      `${quantityToAdd} ${
        quantityToAdd === 1 ? 'item' : 'items'
      } added to your cart.`,
    );
    setQuantity(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {productState.state === 'loading' && (
          <LoadingSpinner message="Loading product..." />
        )}

        {productState.state === 'error' && (
          <ErrorMessage
            title="We could not load this product"
            message={productState.error}
          />
        )}

        {productState.state === 'not-found' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Product not found
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              This product does not exist.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              The product may have been removed, or the link may no longer be
              valid.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Return to the store
            </Link>
          </div>
        )}

        {product && (
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="aspect-square bg-slate-100 lg:aspect-auto">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {product.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-slate-950">
                {priceFormatter.format(product.price)}
              </p>

              <p className="mt-6 text-base leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-8 border-t border-slate-200 pt-6">
                {product.stock > 0 ? (
                  <div>
                    <p className="font-semibold text-emerald-700">
                      In stock
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.stock} units currently available
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-red-700">
                    Currently out of stock
                  </p>
                )}
              </div>

              {product.stock > 0 && (
                <div className="mt-8">
                  {canAddToCart ? (
                    <>
                      {quantityInCart > 0 && (
                        <p className="mb-4 text-sm font-medium text-slate-600">
                          {quantityInCart} already in your cart. You can add up
                          to {remainingStock} more.
                        </p>
                      )}

                      <label
                        htmlFor="product-quantity"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Quantity
                      </label>

                      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex w-fit items-center rounded-xl border border-slate-300 bg-white">
                          <button
                            type="button"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                            className="flex h-12 w-12 items-center justify-center rounded-l-xl text-xl font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <input
                            id="product-quantity"
                            type="number"
                            min="1"
                            max={remainingStock}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="h-12 w-16 border-x border-slate-300 text-center font-semibold text-slate-900 outline-none"
                            aria-label="Product quantity"
                          />

                          <button
                            type="button"
                            onClick={increaseQuantity}
                            disabled={quantity >= remainingStock}
                            className="flex h-12 w-12 items-center justify-center rounded-r-xl text-xl font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="font-semibold text-blue-900">
                        Maximum available stock is already in your cart.
                      </p>

                      <p className="mt-1 text-sm text-blue-700">
                        You currently have all {product.stock} available units.
                      </p>
                    </div>
                  )}

                  {cartMessage && (
                    <p
                      className="mt-4 text-sm font-semibold text-emerald-700"
                      role="status"
                      aria-live="polite"
                    >
                      {cartMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductDetailsPage;