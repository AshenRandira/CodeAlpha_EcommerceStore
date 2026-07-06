import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductCard from '../components/ProductCard.jsx';

function StorePage() {
  const [requestVersion, setRequestVersion] = useState(0);
  const [catalog, setCatalog] = useState({
    state: 'loading',
    products: [],
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setCatalog({
        state: 'loading',
        products: [],
        error: '',
      });

      try {
        const response = await fetch('/api/products', {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load products.');
        }

        if (!Array.isArray(data)) {
          throw new Error('The product API returned an unexpected response.');
        }

        setCatalog({
          state: 'success',
          products: data,
          error: '',
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setCatalog({
          state: 'error',
          products: [],
          error: error.message,
        });
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [requestVersion]);

  function retryLoadingProducts() {
    setRequestVersion((currentVersion) => currentVersion + 1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              CodeAlpha
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Store
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            Product Catalog
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Shop the collection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Useful products for work and everyday life.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse our current catalog, loaded directly from the CodeAlpha
            Store database.
          </p>
        </div>

        <div className="mt-10">
          {catalog.state === 'loading' && (
            <LoadingSpinner message="Loading products..." />
          )}

          {catalog.state === 'error' && (
            <ErrorMessage
              title="We could not load the store"
              message={catalog.error}
              onRetry={retryLoadingProducts}
            />
          )}

          {catalog.state === 'success' &&
            catalog.products.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-xl font-bold text-slate-900">
                  No products available
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The catalog is empty right now. Please check back later.
                </p>
              </div>
            )}

          {catalog.state === 'success' &&
            catalog.products.length > 0 && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    All products
                  </h2>

                  <p className="text-sm font-medium text-slate-500">
                    {catalog.products.length}{' '}
                    {catalog.products.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catalog.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
        </div>
      </section>
    </main>
  );
}

export default StorePage;
