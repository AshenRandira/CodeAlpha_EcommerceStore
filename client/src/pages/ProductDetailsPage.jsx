import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  PackageX,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/useCart.js';
import { lkrFormatter } from '../utils/format.js';

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function ProductDetailsPage() {
  const { id } = useParams();
  const {
    addToCart,
    cartItems,
  } = useCart();

  const [requestVersion, setRequestVersion] = useState(0);
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
        const response = await fetch(
          `/api/products/${encodeURIComponent(id)}`,
          {
            signal: controller.signal,
          },
        );

        const data = await readJsonResponse(response);

        if (response.status === 400) {
          setProductState({
            state: 'invalid-id',
            product: null,
            error: '',
          });
          return;
        }

        if (response.status === 404) {
          setProductState({
            state: 'not-found',
            product: null,
            error: '',
          });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load this product.',
          );
        }

        if (!data?._id) {
          throw new Error(
            'The product response was incomplete.',
          );
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
          error:
            error.message || 'Unable to load this product.',
        });
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [id, requestVersion]);

  const product =
    productState.state === 'success'
      ? productState.product
      : null;

  const cartItem = product
    ? cartItems.find(
        (item) => item.productId === product._id,
      )
    : null;

  const quantityInCart = cartItem?.quantity ?? 0;

  const remainingStock = product
    ? Math.max(
        0,
        product.stock - quantityInCart,
      )
    : 0;

  const canAddToCart =
    Boolean(product) &&
    product.stock > 0 &&
    remainingStock > 0;

  function handleQuantityChange(event) {
    const nextQuantity = Number(event.target.value);

    if (
      !Number.isFinite(nextQuantity) ||
      remainingStock <= 0
    ) {
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
      Math.min(
        remainingStock,
        currentQuantity + 1,
      ),
    );
    setCartMessage('');
  }

  function handleAddToCart() {
    if (!product || !canAddToCart) {
      return;
    }

    const quantityToAdd = Math.min(
      quantity,
      remainingStock,
    );

    const added = addToCart(
      product,
      quantityToAdd,
    );

    if (!added) {
      setCartMessage(
        'This product could not be added to your cart.',
      );
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft
              size={15}
              aria-hidden="true"
            />
            Back to store
          </Link>

          {productState.state === 'loading' && (
            <LoadingSpinner message="Loading product..." />
          )}

          {productState.state === 'error' && (
            <ErrorMessage
              title="Could not load this product"
              message={productState.error}
              onRetry={() =>
                setRequestVersion(
                  (currentVersion) =>
                    currentVersion + 1,
                )
              }
            />
          )}

          {productState.state === 'invalid-id' && (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
              role="alert"
            >
              <h1 className="text-2xl font-bold text-slate-900">
                Invalid product ID
              </h1>

              <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">
                The product address contains an invalid ID.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Return to store
              </Link>
            </div>
          )}

          {productState.state === 'not-found' && (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
              role="alert"
            >
              <h1 className="text-2xl font-bold text-slate-900">
                Product not found
              </h1>

              <p className="mx-auto mt-2 max-w-xl leading-7 text-slate-600">
                This product may have been removed, or the
                link may no longer be valid.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Return to store
              </Link>
            </div>
          )}

          {product && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-square overflow-hidden bg-slate-100 lg:aspect-auto">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col p-7 sm:p-10 lg:p-12">
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {product.category}
                  </span>

                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {product.name}
                  </h1>

                  <p className="mt-4 text-3xl font-extrabold text-blue-600">
                    {lkrFormatter.format(product.price)}
                  </p>

                  <p className="mt-5 text-base leading-7 text-slate-600">
                    {product.description}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-emerald-500"
                          aria-hidden="true"
                        />

                        <span className="text-sm font-semibold text-emerald-700">
                          In stock - {product.stock} units
                          available
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <PackageX
                          size={17}
                          aria-hidden="true"
                        />

                        <span className="text-sm font-semibold">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>

                  {product.stock > 0 && (
                    <div className="mt-6">
                      {quantityInCart > 0 && (
                        <p className="mb-3 text-sm leading-6 text-slate-500">
                          {quantityInCart} already in your
                          cart. You can add up to{' '}
                          {remainingStock} more.
                        </p>
                      )}

                      {canAddToCart ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="flex w-fit items-center rounded-lg border border-slate-300 bg-white">
                            <button
                              type="button"
                              onClick={decreaseQuantity}
                              disabled={quantity <= 1}
                              aria-label="Decrease quantity"
                              className="flex h-11 w-11 items-center justify-center rounded-l-lg text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                            >
                              <Minus
                                size={16}
                                aria-hidden="true"
                              />
                            </button>

                            <input
                              id="product-quantity"
                              type="number"
                              min="1"
                              max={remainingStock}
                              value={quantity}
                              onChange={handleQuantityChange}
                              className="h-11 w-14 border-x border-slate-300 text-center text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                              aria-label="Product quantity"
                            />

                            <button
                              type="button"
                              onClick={increaseQuantity}
                              disabled={
                                quantity >= remainingStock
                              }
                              aria-label="Increase quantity"
                              className="flex h-11 w-11 items-center justify-center rounded-r-lg text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                            >
                              <Plus
                                size={16}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <ShoppingCart
                              size={16}
                              aria-hidden="true"
                            />
                            Add to Cart
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                          <p className="font-semibold text-blue-900">
                            All available stock is in your cart.
                          </p>

                          <p className="mt-1 text-sm leading-6 text-blue-700">
                            You currently have all{' '}
                            {product.stock} available units.
                          </p>
                        </div>
                      )}

                      {cartMessage && (
                        <p
                          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-700"
                          role="status"
                          aria-live="polite"
                        >
                          <CheckCircle2
                            size={15}
                            aria-hidden="true"
                          />
                          {cartMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetailsPage;