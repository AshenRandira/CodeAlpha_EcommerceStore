import { Link } from 'react-router';
import {
  ArrowRight,
  BadgeCheck,
  Phone,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';

const SHOP_LINKS = [
  {
    to: '/',
    label: 'Browse Store',
  },
  {
    to: '/cart',
    label: 'Shopping Cart',
  },
];

const ACCOUNT_LINKS = [
  {
    to: '/profile',
    label: 'My Profile',
  },
  {
    to: '/orders',
    label: 'My Orders',
  },
];

const STORE_PROMISES = [
  {
    icon: Truck,
    label: 'Island-wide delivery',
  },
  {
    icon: BadgeCheck,
    label: 'Quality products',
  },
  {
    icon: ShieldCheck,
    label: 'Secure ordering',
  },
  {
    icon: Phone,
    label: 'Local support',
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-950 text-slate-300">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-cyan-400/10 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                Explore Nexus Tech
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                Find tech that fits your everyday life.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Browse audio gear, accessories, wearables, workspace
                essentials, and more from the complete catalog.
              </p>
            </div>

            <Link
              to="/"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Browse products

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
          <div>
            <Link
              to="/"
              aria-label="Nexus Tech home"
              className="group inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-950/40 transition group-hover:scale-105">
                <Zap
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-sm font-extrabold tracking-wide text-white">
                  Nexus Tech
                </p>

                <p className="text-[11px] font-medium leading-none text-slate-500">
                  Sri Lanka
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A modern Sri Lankan tech store for everyday devices,
              accessories, audio gear, and workspace essentials.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5">
              <span
                className="h-2 w-2 rounded-full bg-cyan-400"
                aria-hidden="true"
              />

              <span className="text-xs font-semibold text-cyan-200">
                Modern tech. Local support.
              </span>
            </div>
          </div>

          <nav aria-label="Footer shop navigation">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Shop
            </p>

            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex rounded-sm text-sm font-medium text-slate-400 transition hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer account navigation">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Account
            </p>

            <ul className="mt-5 space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex rounded-sm text-sm font-medium text-slate-400 transition hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              What We Offer
            </p>

            <ul className="mt-5 space-y-3.5">
              {STORE_PROMISES.map(
                ({
                  icon: Icon,
                  label,
                }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/10 text-cyan-300">
                      <Icon
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span>{label}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {currentYear} Nexus Tech. All rights reserved.
          </p>

          <p>
            Built as a CodeAlpha Full Stack Internship project.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;