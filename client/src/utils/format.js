/**
 * Shared display formatters for currency and dates.
 */

export const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const shortDateFormatter =
  new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const longDateFormatter =
  new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export function formatDate(
  value,
  formatter = shortDateFormatter,
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  try {
    return formatter.format(date);
  } catch {
    return 'Date unavailable';
  }
}