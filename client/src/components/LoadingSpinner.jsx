function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
