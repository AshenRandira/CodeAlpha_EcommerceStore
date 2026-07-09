import { Link } from 'react-router';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
          aria-labelledby="not-found-title"
        >
          <p
            className="text-5xl font-black text-slate-200"
            aria-hidden="true"
          >
            404
          </p>

          <h1
            id="not-found-title"
            className="mt-3 text-xl font-extrabold text-slate-900"
          >
            Page not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The page you are looking for does not exist or may have
            been moved.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to store
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;