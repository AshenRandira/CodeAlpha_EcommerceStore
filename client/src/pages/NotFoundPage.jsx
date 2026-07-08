import { Link } from 'react-router';
import Navbar from '../components/Navbar.jsx';

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            404
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Page not found.
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            The page you requested does not exist or may have moved.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Back to store
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;