import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router';
import { useAuth } from '../context/useAuth.js';
import LoadingSpinner from './LoadingSpinner.jsx';

function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <LoadingSpinner message="Checking your session..." />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    const destination =
      `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: destination }}
      />
    );
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
