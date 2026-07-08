import { useState } from 'react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const INITIAL_SHIPPING_ADDRESS = {
  fullName: '',
  addressLine1: '',
  city: '',
  postalCode: '',
  country: '',
};

const SHIPPING_FIELDS = [
  {
    name: 'fullName',
    label: 'Full name',
    autoComplete: 'name',
    maxLength: 120,
  },
  {
    name: 'addressLine1',
    label: 'Address',
    autoComplete: 'street-address',
    maxLength: 200,
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
  const {
    token,
    user,
  } = useAuth();

  const {
    cartItems,
    itemCount,
    subtotal,
    clearCart,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState(() => ({
    ...INITIAL_SHIPPING_ADDRESS,
    fullName: user?.name || '',
  }));

  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  function handleFieldChange(event) {
    const {
      name,
      value,
    } = event.target;

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
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Order placed
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              Your order was created successfully and saved to your account.
            </p>

            <dl className="mx-auto mt-8 max-w-md divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 text-left">
              <div className="grid gap-2 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-4">
                <dt className="text-sm font-medium text-slate-600">
                  Order ID
                </dt>

                <dd className="min-w-0 break-all font-mono text-xs font-semibold text-slate-950 sm:text-right">
                  {createdOrder._id}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-sm font-medium text-slate-600">
                  Status
                </dt>

                <dd className="text-sm font-semibold capitalize text-slate-950">
                  {createdOrder.status}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="font-medium text-slate-700">
                  Subtotal
                </dt>

                <dd className="text-xl font-bold text-slate-950">
                  {priceFormatter.format(createdOrder.subtotal)}
                </dd>
              </div>
            </dl>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500">
              Your cart was cleared only after the server confirmed the order.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to={`/orders/${createdOrder._id}`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                View order details
              </Link>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                View my orders
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Checkout
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your cart is empty.
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              Add at least one product before placing an order.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Browse products
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Return to cart
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Checkout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Complete your order
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Enter your shipping details and review your cart before placing the order.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Shipping address
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {SHIPPING_FIELDS.map((field) => {
                const fieldError = validationErrors[field.name];

                return (
                  <div
                    key={field.name}
                    className={
                      field.name === 'addressLine1'
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
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    {fieldError && (
                      <p
                        id={`${field.name}-error`}
                        className="mt-2 text-sm font-medium text-red-700"
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
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                role="alert"
              >
                {submitError}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                {isSubmitting
                  ? 'Placing order...'
                  : 'Place order'}
              </button>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Return to cart
              </Link>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Order summary
            </h2>

            <div className="mt-6 space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b border-slate-200 pb-5 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-950">
                    {priceFormatter.format(
                      item.price * item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Items</span>
                <span className="font-semibold text-slate-950">
                  {itemCount}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-900">
                  Cart subtotal
                </span>

                <span className="text-2xl font-bold text-slate-950">
                  {priceFormatter.format(subtotal)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                The server will verify current product prices and calculate the final subtotal before saving your order.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CheckoutPage;
