import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router';
import {
  BadgeCheck,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Truck,
} from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';

const SORT_OPTIONS = [
  {
    value: 'default',
    label: 'Featured',
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
  },
  {
    value: 'name-asc',
    label: 'Name A-Z',
  },
];

const BENEFITS = [
  {
    icon: Truck,
    title: 'Island-wide Delivery',
    description: 'Across Sri Lanka',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Ordering',
    description: 'Protected account flow',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Products',
    description: 'Tech for everyday use',
  },
  {
    icon: Phone,
    title: 'Local Support',
    description: 'Help when you need it',
  },
];

const HERO_CATEGORIES = [
  'Audio',
  'Computer Accessories',
  'Mobile Accessories',
  'Wearables',
  'Home Office',
  'Bags',
];

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function normalizeSearchText(value) {
  return typeof value === 'string'
    ? value.trim().toLowerCase().replace(/\s+/g, ' ')
    : '';
}

function getSearchRank(product, searchQuery) {
  const name = normalizeSearchText(product.name);
  const category = normalizeSearchText(
    product.category,
  );

  if (!name || !searchQuery) {
    return null;
  }

  if (name === searchQuery) {
    return 0;
  }

  if (name.startsWith(searchQuery)) {
    return 1;
  }

  if (name.includes(searchQuery)) {
    return 2;
  }

  if (category === searchQuery) {
    return 3;
  }

  if (category.includes(searchQuery)) {
    return 4;
  }

  return null;
}

function getSearchResults(products, searchQuery) {
  return products
    .map((product, originalIndex) => ({
      product,
      originalIndex,
      rank: getSearchRank(
        product,
        searchQuery,
      ),
    }))
    .filter((result) => result.rank !== null)
    .sort(
      (firstResult, secondResult) =>
        firstResult.rank - secondResult.rank ||
        firstResult.originalIndex -
          secondResult.originalIndex,
    )
    .map((result) => result.product);
}

function sortProducts(products, sortValue) {
  const sortedProducts = [...products];

  if (sortValue === 'price-asc') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.price - secondProduct.price,
    );
  }

  if (sortValue === 'price-desc') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.price - firstProduct.price,
    );
  }

  if (sortValue === 'name-asc') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(
          secondProduct.name,
        ),
    );
  }

  return sortedProducts;
}

function StorePage() {
  const [
    requestVersion,
    setRequestVersion,
  ] = useState(0);

  const [catalog, setCatalog] = useState({
    state: 'loading',
    products: [],
    error: '',
  });

  const [
    activeCategory,
    setActiveCategory,
  ] = useState('All');

  const [sortValue, setSortValue] =
    useState('default');

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const rawSearchQuery =
    searchParams.get('q') ?? '';

  const searchQuery =
    normalizeSearchText(rawSearchQuery);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setCatalog({
        state: 'loading',
        products: [],
        error: '',
      });

      try {
        const response = await fetch(
          '/api/products',
          {
            signal: controller.signal,
          },
        );

        const data =
          await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to load products.',
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            'The product response was incomplete.',
          );
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
          error:
            error.message ||
            'Unable to load products.',
        });
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [requestVersion]);

  const categories = useMemo(() => {
    const categoryNames = catalog.products
      .map((product) => product.category)
      .filter(
        (category) =>
          typeof category === 'string' &&
          category.trim(),
      );

    const uniqueCategories = [
      ...new Set(categoryNames),
    ].sort();

    return ['All', ...uniqueCategories];
  }, [catalog.products]);

  useEffect(() => {
    if (searchQuery) {
      setActiveCategory('All');
    }
  }, [searchQuery]);

  const displayedProducts = useMemo(() => {
    let products = catalog.products;

    if (searchQuery) {
      products = getSearchResults(
        products,
        searchQuery,
      );
    }

    if (activeCategory !== 'All') {
      products = products.filter(
        (product) =>
          product.category === activeCategory,
      );
    }

    return sortProducts(
      products,
      sortValue,
    );
  }, [
    catalog.products,
    searchQuery,
    activeCategory,
    sortValue,
  ]);

  const isFiltered =
    Boolean(searchQuery) ||
    activeCategory !== 'All';

  function clearFilters() {
    setActiveCategory('All');
    setSortValue('default');
    setSearchParams({});
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-slate-50 to-indigo-50">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-blue-900/20 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700">
          <div
            className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300 sm:text-base">
                Sri Lankan Tech Store
              </p>

              <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Nexus Tech
              </h1>

              <p className="mt-3 text-lg font-semibold text-blue-100 sm:text-xl">
                Modern technology for Sri Lanka
              </p>

              <div className="mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-cyan-300 via-blue-200 to-transparent" />

              <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Smart tech for
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-100 bg-clip-text text-transparent">
                  everyday life.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                Explore audio gear, computer accessories, mobile
                essentials, wearables, and workspace upgrades in
                one modern storefront.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                >
                  Shop now
                </a>

                <span className="text-sm font-medium text-blue-200">
                  Trusted tech picks for work, study, and everyday
                  use
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div
                className="absolute inset-6 rounded-3xl bg-cyan-300/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 via-blue-300/10 to-cyan-300/10 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                      Explore Nexus Tech
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Shop by category
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 to-cyan-300/10 text-cyan-200">
                    <Tag
                      size={20}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {HERO_CATEGORIES.map(
                    (category, index) => (
                      <a
                        key={category}
                        href="#catalog"
                        className={`rounded-2xl border p-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                          index === 0 ||
                          index === 5
                            ? 'border-cyan-300/25 bg-gradient-to-br from-cyan-300/15 to-blue-300/10 text-cyan-100'
                            : 'border-white/10 bg-gradient-to-br from-white/10 to-blue-300/5 text-blue-100'
                        }`}
                      >
                        {category}
                      </a>
                    ),
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-950/30 to-blue-950/20 p-4">
                  <p className="text-sm leading-6 text-blue-100">
                    Browse the complete catalog, compare prices,
                    and open any product for full details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-2 sm:grid-cols-4">
              {BENEFITS.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <li
                    key={title}
                    className="flex items-center gap-3 border-b border-r border-blue-100/80 px-3 py-4 last:border-r-0 sm:border-b-0 sm:px-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-white/80 to-blue-100 text-blue-600 shadow-sm">
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {title}
                      </p>

                      <p className="mt-0.5 hidden text-xs text-slate-500 lg:block">
                        {description}
                      </p>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        <section
          id="catalog"
          className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-blue-100/80 via-slate-50 to-indigo-100/70"
        >
          <div
            className="pointer-events-none absolute -right-20 top-16 h-96 w-96 rounded-full bg-cyan-200/45 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-200/45 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {catalog.state === 'loading' && (
              <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white/85 via-blue-50/80 to-indigo-50/80 py-20 shadow-lg shadow-blue-900/5 backdrop-blur">
                <LoadingSpinner message="Loading products..." />
              </div>
            )}

            {catalog.state === 'error' && (
              <ErrorMessage
                title="Could not load the store"
                message={catalog.error}
                onRetry={() =>
                  setRequestVersion(
                    (currentVersion) =>
                      currentVersion + 1,
                  )
                }
              />
            )}

            {catalog.state === 'success' &&
              catalog.products.length === 0 && (
                <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-50/80 px-6 py-16 text-center shadow-lg shadow-blue-900/5 backdrop-blur">
                  <h2 className="text-xl font-bold text-slate-900">
                    No products available
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    The catalog is currently empty. Please try
                    again later.
                  </p>
                </div>
              )}

            {catalog.state === 'success' &&
              catalog.products.length > 0 && (
                <>
                  <div className="mb-8 rounded-3xl border border-blue-100/80 bg-gradient-to-r from-white/85 via-blue-50/85 to-indigo-50/85 p-4 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filter by category"
                      >
                        {categories.map(
                          (category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                setActiveCategory(
                                  category,
                                )
                              }
                              aria-pressed={
                                activeCategory ===
                                category
                              }
                              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                activeCategory ===
                                category
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200/60'
                                  : 'border border-blue-100 bg-blue-50/70 text-slate-700 hover:border-blue-300 hover:bg-cyan-50 hover:text-blue-700'
                              }`}
                            >
                              {category}
                            </button>
                          ),
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <SlidersHorizontal
                          size={15}
                          className="text-blue-400"
                          aria-hidden="true"
                        />

                        <select
                          value={sortValue}
                          onChange={(event) =>
                            setSortValue(
                              event.target.value,
                            )
                          }
                          aria-label="Sort products"
                          className="rounded-xl border border-blue-100 bg-gradient-to-r from-white/90 to-blue-50/90 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          {SORT_OPTIONS.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 rounded-2xl border border-blue-100/70 bg-gradient-to-r from-blue-50/80 via-white/65 to-indigo-50/80 px-5 py-4 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                          Nexus Tech Catalog
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                          {isFiltered
                            ? searchQuery
                              ? `Results for "${rawSearchQuery}"`
                              : activeCategory
                            : 'All Products'}
                        </h2>
                      </div>

                      <span className="w-fit rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-sm font-semibold text-blue-700">
                        {displayedProducts.length}{' '}
                        {displayedProducts.length ===
                        1
                          ? 'product'
                          : 'products'}
                      </span>
                    </div>
                  </div>

                  {displayedProducts.length ===
                  0 ? (
                    <div className="rounded-3xl border border-dashed border-blue-200 bg-gradient-to-br from-white/85 via-blue-50/80 to-indigo-50/80 px-6 py-16 text-center shadow-lg shadow-blue-900/5 backdrop-blur">
                      <p className="text-base font-semibold text-slate-700">
                        No products match your search.
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Try a product name or category.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-lg bg-gradient-to-r from-slate-900 to-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {displayedProducts.map(
                        (product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                          />
                        ),
                      )}
                    </div>
                  )}
                </>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default StorePage;