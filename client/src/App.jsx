import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState({
    state: 'loading',
    data: null,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    async function checkApiHealth() {
      try {
        const response = await fetch('/api/health', {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'API health check failed.');
        }

        setHealth({
          state: 'success',
          data,
          error: '',
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setHealth({
          state: 'error',
          data: null,
          error: error.message,
        });
      }
    }

    checkApiHealth();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            CodeAlpha Project
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            CodeAlpha E-commerce Store
          </h1>

          <p className="mt-4 text-slate-600">
            Milestone M0 foundation: React, Vite, Tailwind CSS, Express, and
            MongoDB.
          </p>

          <div className="mt-8 rounded-xl bg-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              API Health
            </h2>

            {health.state === 'loading' && (
              <p className="mt-2 text-slate-600">
                Checking the Express API...
              </p>
            )}

            {health.state === 'success' && (
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>
                  Status:{' '}
                  <span className="font-semibold text-green-700">
                    {health.data.status}
                  </span>
                </p>
                <p>Service: {health.data.service}</p>
                <p>Database: {health.data.database}</p>
                <p>Timestamp: {health.data.timestamp}</p>
              </div>
            )}

            {health.state === 'error' && (
              <div className="mt-3">
                <p className="font-semibold text-red-700">
                  API connection failed
                </p>
                <p className="mt-1 text-sm text-red-600">{health.error}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;