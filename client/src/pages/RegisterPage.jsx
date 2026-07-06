import { useState } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/useAuth.js';

function getRedirectTarget(location) {
  const destination = location.state?.from;

  return typeof destination === 'string' && destination.startsWith('/')
    ? destination
    : '/';
}

function RegisterPage() {
  const {
    isAuthenticated,
    isLoading: isSessionLoading,
    register,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = getRedirectTarget(location);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const name = form.name.trim();
    const email = form.email.trim();

    if (name.length < 2 || name.length > 60) {
      setFormError('Name must be between 2 and 60 characters.');
      return;
    }

    if (!email) {
      setFormError('A valid email address is required.');
      return;
    }

    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password: form.password,
      });

      navigate(redirectTarget, {
        replace: true,
      });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSessionLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-xl px-5 py-12 sm:px-6">
          <LoadingSpinner message="Checking your session..." />
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5 py-12 sm:px-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <Link to="/" className="inline-block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              CodeAlpha
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Store
            </p>
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Register to continue with authenticated store features.
            </p>
          </div>

          {formError && (
            <div
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
              role="alert"
            >
              <p className="text-sm font-medium text-red-800">
                {formError}
              </p>
            </div>
          )}

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-800"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                minLength="2"
                maxLength="60"
                value={form.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Your name"
              />
            </div>

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
                autoComplete="new-password"
                minLength="8"
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="At least 8 characters"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
