import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ProductDetailsPage() {
  const { id } = useParams();

  const [productState, setProductState] = useState({
    state: 'loading',
    product: null,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setProductState({
        state: 'loading',
        product: null,
        error: '',
      });

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

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="group">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              CodeAlpha
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-slate-950 group-hover:text-blue-700">
              Store
            </p>
          </Link>

          <Link
            to="/"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Back to store
          </Link>
        </div>
      </header>

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

        {productState.state === 'success' && (
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="aspect-square bg-slate-100 lg:aspect-auto">
              <img
                src={productState.product.imageUrl}
                alt={productState.product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {productState.product.category}
              </span>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {productState.product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-slate-950">
                {priceFormatter.format(productState.product.price)}
              </p>

              <p className="mt-6 text-base leading-7 text-slate-600">
                {productState.product.description}
              </p>

              <div className="mt-8 border-t border-slate-200 pt-6">
                {productState.product.stock > 0 ? (
                  <div>
                    <p className="font-semibold text-emerald-700">
                      In stock
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {productState.product.stock} units currently available
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-red-700">
                    Currently out of stock
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductDetailsPage;
