import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';

function Navbar() {
  const {
    isAuthenticated,
    isLoading,
    logout,
    user,
  } = useAuth();

  const { itemCount } = useCart();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group shrink-0"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            CodeAlpha
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950 transition group-hover:text-blue-700">
            Store
          </p>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-2 sm:gap-3"
          aria-label="Main navigation"
        >
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            aria-label={`Cart with ${itemCount} ${
              itemCount === 1 ? 'item' : 'items'
            }`}
          >
            <span>Cart</span>

            <span className="flex min-h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
              {itemCount}
            </span>
          </Link>

          {isLoading ? (
            <span className="text-sm font-medium text-slate-500">
              Checking session...
            </span>
          ) : isAuthenticated ? (
            <>
              <Link
                to="/orders"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                My orders
              </Link>

              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-4"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-4"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:px-4"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;