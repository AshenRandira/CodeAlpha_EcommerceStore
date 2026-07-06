function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-6"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-red-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
