import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router';
import {
  Package,
  Search,
  ShoppingCart,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';

function Navbar() {
  const {
    isAuthenticated,
    isLoading,
    user,
  } = useAuth();

  const { itemCount } = useCart();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentSearchQuery =
    searchParams.get('q') ?? '';

  const [query, setQuery] = useState(
    currentSearchQuery,
  );

  const [searchOpen, setSearchOpen] =
    useState(false);

  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    setQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  function jumpToCatalog() {
    let attempts = 0;

    function findAndScroll() {
      const catalog =
        document.getElementById('catalog');

      if (catalog) {
        catalog.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });

        return;
      }

      attempts += 1;

      if (attempts < 10) {
        window.setTimeout(
          findAndScroll,
          50,
        );
      }
    }

    window.requestAnimationFrame(
      findAndScroll,
    );
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(
        `/?q=${encodeURIComponent(trimmedQuery)}`,
      );

      setSearchOpen(false);
      jumpToCatalog();

      return;
    }

    navigate('/');
    setSearchOpen(false);
  }

  function handleDesktopClearSearch() {
    setQuery('');
    navigate('/');

    window.requestAnimationFrame(() => {
      desktopSearchInputRef.current?.focus();
    });
  }

  function handleMobileClearSearch() {
    setQuery('');
    navigate('/');

    window.requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus();
    });
  }

  function handleOpenSearch() {
    setSearchOpen(true);

    window.requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus();
    });
  }

  function handleCloseSearch() {
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-gradient-to-r from-slate-50/95 via-blue-50/95 to-indigo-50/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Link
            to="/"
            aria-label="Nexus Tech home"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl border border-blue-100/80 bg-gradient-to-r from-white/80 to-blue-50/80 px-2 py-1.5 shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200/60 transition group-hover:scale-105">
              <Zap
                size={18}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            <div className="hidden flex-col sm:flex">
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-sm font-black uppercase tracking-[0.14em] text-transparent">
                Nexus Tech
              </span>

              <span className="text-[10px] font-semibold leading-none text-slate-500">
                Sri Lankan Tech Store
              </span>
            </div>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden max-w-md flex-1 md:block"
            role="search"
          >
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                aria-hidden="true"
              />

              <input
                ref={desktopSearchInputRef}
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
                enterKeyHint="search"
                className="w-full rounded-xl border border-blue-100 bg-white/75 py-2 pl-9 pr-9 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              {query && (
                <button
                  type="button"
                  onClick={handleDesktopClearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X
                    size={14}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </form>

          <nav
            className="flex shrink-0 items-center gap-1 sm:gap-2"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={handleOpenSearch}
              aria-label="Open product search"
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-100/70 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 md:hidden"
            >
              <Search
                size={18}
                aria-hidden="true"
              />
            </button>

            <Link
              to="/cart"
              className="relative flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-100/70 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label={`Cart with ${itemCount} ${
                itemCount === 1 ? 'item' : 'items'
              }`}
            >
              <ShoppingCart
                size={18}
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                Cart
              </span>

              {itemCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
                  aria-hidden="true"
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div
                className="flex h-9 items-center px-2"
                role="status"
                aria-label="Checking account session"
              >
                <span className="h-4 w-14 animate-pulse rounded bg-blue-100" />
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-100/70 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="My orders"
                >
                  <Package
                    size={16}
                    aria-hidden="true"
                  />

                  <span className="hidden sm:inline">
                    Orders
                  </span>
                </Link>

                <div
                  className="hidden h-5 w-px bg-blue-200 lg:block"
                  aria-hidden="true"
                />

                <Link
                  to="/profile"
                  title="View profile"
                  aria-label={`Open profile for ${
                    user?.name || 'your account'
                  }`}
                  className="group flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg border border-transparent px-1.5 text-slate-700 transition hover:border-blue-100 hover:bg-white/70 hover:text-blue-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 lg:justify-start lg:px-2.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 transition group-hover:from-blue-200 group-hover:to-cyan-100">
                    <User
                      size={14}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    className="hidden max-w-[120px] truncate text-sm font-semibold lg:inline"
                    title={user?.name}
                  >
                    {user?.name}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-100/70 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:flex"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="flex h-9 items-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:px-4"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {searchOpen && (
          <div className="border-t border-blue-100 pb-3 pt-2 md:hidden">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                  aria-hidden="true"
                />

                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search products..."
                  aria-label="Search products"
                  enterKeyHint="search"
                  className="w-full rounded-xl border border-blue-100 bg-white/80 py-2.5 pl-9 pr-20 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {query && (
                    <button
                      type="button"
                      onClick={handleMobileClearSearch}
                      aria-label="Clear search"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <X
                        size={14}
                        aria-hidden="true"
                      />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    aria-label="Close search"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <X
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;