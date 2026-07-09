import { useState } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router';
import { Zap } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/useAuth.js';

function getRedirectTarget(location) {
  const destination = location.state?.from;

  return (
    typeof destination === 'string' &&
    destination.startsWith('/') &&
    !destination.startsWith('//')
  )
    ? destination
    : '/';
}

function LoginPage() {
  const {
    isAuthenticated,
    isLoading: isSessionLoading,
    login,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = getRedirectTarget(location);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (formError) {
      setFormError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const email = form.email.trim();

    if (!email || !form.password) {
      setFormError(
        'Email and password are required.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email,
        password: form.password,
      });

      navigate(redirectTarget, {
        replace: true,
      });
    } catch (error) {
      setFormError(
        error.message || 'Unable to log in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSessionLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <LoadingSpinner message="Checking your session..." />
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={redirectTarget}
        replace
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <Link
            to="/"
            aria-label="Nexus Tech home"
            className="inline-flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Nexus Tech
              </p>

              <p className="text-[10px] font-medium leading-none text-slate-400">
                Sri Lanka
              </p>
            </div>
          </Link>

          <div className="mt-7">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Log in to your Nexus Tech account.
            </p>
          </div>

          {formError && (
            <div
              id="login-error"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
              role="alert"
            >
              <p className="text-sm font-medium leading-6 text-red-800">
                {formError}
              </p>
            </div>
          )}

          <form
            className="mt-7 space-y-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-800"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                aria-describedby={
                  formError ? 'login-error' : undefined
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                aria-describedby={
                  formError ? 'login-error' : undefined
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting
                ? 'Logging in...'
                : 'Log in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Need an account?{' '}

            <Link
              to="/register"
              state={location.state}
              className="rounded-sm font-semibold text-blue-700 transition hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;