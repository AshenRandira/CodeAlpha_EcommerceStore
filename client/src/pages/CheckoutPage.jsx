import { useState } from 'react';
import { Link } from 'react-router';
import {
  CheckCircle2,
  Package,
} from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';
import { lkrFormatter } from '../utils/format.js';

const SHIPPING_FIELDS = [
  {
    name: 'fullName',
    label: 'Full name',
    autoComplete: 'name',
    maxLength: 120,
    colSpan: true,
  },
  {
    name: 'addressLine1',
    label: 'Address',
    autoComplete: 'street-address',
    maxLength: 200,
    colSpan: true,
  },
  {
    name: 'city',
    label: 'City',
    autoComplete: 'address-level2',
    maxLength: 100,
  },
  {
    name: 'postalCode',
    label: 'Postal code',
    autoComplete: 'postal-code',
    maxLength: 40,
  },
  {
    name: 'country',
    label: 'Country',
    autoComplete: 'country-name',
    maxLength: 100,
    colSpan: true,
  },
];

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function validateShippingAddress(shippingAddress) {
  const errors = {};

  for (const field of SHIPPING_FIELDS) {
    const value = shippingAddress[field.name].trim();

    if (!value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (value.length > field.maxLength) {
      errors[field.name] = `${field.label} is too long.`;
    }
  }

  return errors;
}

function CheckoutPage() {
  const { token, user } = useAuth();

  const {
    cartItems,
    itemCount,
    subtotal,
    clearCart,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name ?? '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));

    setValidationErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[name];

      return nextErrors;
    });

    setSubmitError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || cartItems.length === 0) {
      return;
    }

    const nextValidationErrors =
      validateShippingAddress(shippingAddress);

    if (Object.keys(nextValidationErrors).length > 0) {
      setValidationErrors(nextValidationErrors);
      setSubmitError('');
      return;
    }

    setValidationErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    const requestBody = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country.trim(),
      },
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to place your order.',
        );
      }

      if (!data.order?._id) {
        throw new Error(
          'The order response was incomplete.',
        );
      }

      setCreatedOrder(data.order);

      // Clear the cart only after the server confirms
      // that the order was successfully created.
      clearCart();
    } catch (error) {
      setSubmitError(
        error.message || 'Unable to place your order.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdOrder) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <CheckCircle2
              size={52}
              strokeWidth={1.5}
              className="mx-auto text-emerald-500"
              aria-hidden="true"
            />

            <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Order placed!
            </h1>

            <p className="mt-3 leading-6 text-slate-600">
              Thank you for shopping with Nexus Tech. Your order
              has been saved to your account.
            </p>

            <dl className="mx-auto mt-7 max-w-sm divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50 text-left text-sm">
              <div className="grid gap-2 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-4">
                <dt className="text-slate-500">
                  Order ID
                </dt>

                <dd className="min-w-0 break-all font-mono text-xs font-semibold leading-5 text-slate-900 sm:text-right">
                  {createdOrder._id}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-slate-500">
                  Status
                </dt>

                <dd className="font-semibold capitalize text-slate-900">
                  {createdOrder.status}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="font-semibold text-slate-700">
                  Total
                </dt>

                <dd className="text-lg font-extrabold text-slate-900">
                  {lkrFormatter.format(createdOrder.subtotal)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Your cart was cleared only after the server
              confirmed the order.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                to={`/orders/${createdOrder._id}`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View order details
              </Link>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                My orders
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue shopping
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <Package
              size={40}
              strokeWidth={1.5}
              className="mx-auto text-slate-300"
              aria-hidden="true"
            />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add at least one product before checking out.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse products
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View cart
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Checkout
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Enter your shipping details and confirm your order.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-lg font-bold text-slate-900">
                Shipping address
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {SHIPPING_FIELDS.map((field) => {
                  const fieldError =
                    validationErrors[field.name];

                  return (
                    <div
                      key={field.name}
                      className={
                        field.colSpan
                          ? 'sm:col-span-2'
                          : ''
                      }
                    >
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-semibold text-slate-800"
                      >
                        {field.label}
                      </label>

                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={shippingAddress[field.name]}
                        onChange={handleFieldChange}
                        autoComplete={field.autoComplete}
                        maxLength={field.maxLength}
                        aria-invalid={Boolean(fieldError)}
                        aria-describedby={
                          fieldError
                            ? `${field.name}-error`
                            : undefined
                        }
                        className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          fieldError
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />

                      {fieldError && (
                        <p
                          id={`${field.name}-error`}
                          className="mt-1.5 text-xs font-medium text-red-600"
                        >
                          {fieldError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {submitError && (
                <div
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-red-700"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isSubmitting
                    ? 'Placing order...'
                    : 'Place Order'}
                </button>

                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Return to cart
                </Link>
              </div>
            </form>

            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-20">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {lkrFormatter.format(
                        item.price * item.quantity,
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                  <span>
                    Items ({itemCount})
                  </span>

                  <span className="font-semibold text-slate-900">
                    {lkrFormatter.format(subtotal)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">
                    Cart total
                  </span>

                  <span className="text-xl font-extrabold text-slate-900">
                    {lkrFormatter.format(subtotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The server verifies current product prices and
                  calculates the final total when you place the
                  order.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutPage;