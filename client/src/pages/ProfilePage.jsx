import {
    CalendarDays,
    ChevronRight,
    Fingerprint,
    LogOut,
    Mail,
    Package,
    ShieldCheck,
    ShoppingCart,
    Store,
    UserRound,
    Zap,
  } from 'lucide-react';
  import {
    Link,
    useNavigate,
  } from 'react-router';
  import Footer from '../components/Footer.jsx';
  import Navbar from '../components/Navbar.jsx';
  import { useAuth } from '../context/useAuth.js';
  import {
    formatDate,
    longDateFormatter,
  } from '../utils/format.js';

  const QUICK_LINKS = [
    {
      to: '/orders',
      icon: Package,
      title: 'My Orders',
      description: 'Review your order history',
    },
    {
      to: '/cart',
      icon: ShoppingCart,
      title: 'Shopping Cart',
      description: 'Manage products in your cart',
    },
    {
      to: '/',
      icon: Store,
      title: 'Continue Shopping',
      description: 'Browse the product catalog',
    },
  ];

  function formatRole(role) {
    if (typeof role !== 'string' || !role.trim()) {
      return 'User';
    }

    const normalizedRole = role.trim();

    return (
      normalizedRole.charAt(0).toUpperCase() +
      normalizedRole.slice(1)
    );
  }

  function ProfilePage() {
    const {
      logout,
      user,
    } = useAuth();

    const navigate = useNavigate();

    function handleLogout() {
      logout();

      navigate('/login', {
        replace: true,
      });
    }

    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/70 to-indigo-50">
          <div
            className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl"
            aria-hidden="true"
          />

          <section className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-blue-900/10 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 shadow-xl shadow-blue-900/10">
              <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                <div
                  className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"
                  aria-hidden="true"
                />

                <div
                  className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-64 rounded-full bg-indigo-400/20 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 backdrop-blur">
                      <UserRound
                        size={30}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Zap
                          size={14}
                          className="text-cyan-300"
                          aria-hidden="true"
                        />

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                          Nexus Tech Account
                        </p>
                      </div>

                      <h1 className="mt-2 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        {user.name}
                      </h1>

                      <p className="mt-1 break-all text-sm text-blue-100">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
                    {formatRole(user.role)} account
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <section className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Account Information
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                    Your details
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    These details are connected to your Nexus Tech
                    account and authenticated session.
                  </p>
                </div>

                <dl className="mt-7 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="grid gap-3 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:p-5">
                    <dt className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <UserRound
                        size={17}
                        className="text-blue-600"
                        aria-hidden="true"
                      />

                      Full name
                    </dt>

                    <dd className="break-words font-semibold text-slate-900 sm:text-right">
                      {user.name}
                    </dd>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:p-5">
                    <dt className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <Mail
                        size={17}
                        className="text-blue-600"
                        aria-hidden="true"
                      />

                      Email address
                    </dt>

                    <dd className="break-all font-semibold text-slate-900 sm:text-right">
                      {user.email}
                    </dd>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:p-5">
                    <dt className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <ShieldCheck
                        size={17}
                        className="text-blue-600"
                        aria-hidden="true"
                      />

                      Account role
                    </dt>

                    <dd className="font-semibold text-slate-900 sm:text-right">
                      {formatRole(user.role)}
                    </dd>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:p-5">
                    <dt className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <CalendarDays
                        size={17}
                        className="text-blue-600"
                        aria-hidden="true"
                      />

                      Member since
                    </dt>

                    <dd className="font-semibold text-slate-900 sm:text-right">
                      {formatDate(
                        user.createdAt,
                        longDateFormatter,
                      )}
                    </dd>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:p-5">
                    <dt className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                      <Fingerprint
                        size={17}
                        className="text-blue-600"
                        aria-hidden="true"
                      />

                      Account ID
                    </dt>

                    <dd className="min-w-0 break-all font-mono text-xs font-semibold leading-5 text-slate-700 sm:text-right">
                      {user.id}
                    </dd>
                  </div>
                </dl>
              </section>

              <aside className="space-y-6">
                <section className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Quick Access
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold text-slate-900">
                    Your account
                  </h2>

                  <div className="mt-5 space-y-3">
                    {QUICK_LINKS.map(
                      ({
                        to,
                        icon: Icon,
                        title,
                        description,
                      }) => (
                        <Link
                          key={to}
                          to={to}
                          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                            <Icon
                              size={18}
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900">
                              {title}
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-slate-500">
                              {description}
                            </p>
                          </div>

                          <ChevronRight
                            size={16}
                            className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500"
                            aria-hidden="true"
                          />
                        </Link>
                      ),
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-red-100 bg-gradient-to-br from-white to-red-50/70 p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                    Session
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold text-slate-900">
                    Log out of your account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your shopping cart will remain available after
                    logout.
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <LogOut
                      size={17}
                      aria-hidden="true"
                    />

                    Log out
                  </button>
                </section>
              </aside>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  export default ProfilePage;
