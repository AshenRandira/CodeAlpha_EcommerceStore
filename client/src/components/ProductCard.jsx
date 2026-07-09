import {
  useState,
} from 'react';
import { Link } from 'react-router';
import {
  ImageOff,
  PackageX,
} from 'lucide-react';
import { lkrFormatter } from '../utils/format.js';

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  const inStock = product.stock > 0;

  return (
    <Link
      to={`/products/${product._id}`}
      aria-label={`View ${product.name}`}
      className="group block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-lg">
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {imageError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-slate-400">
              <ImageOff
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span className="text-xs font-medium">
                Image unavailable
              </span>
            </div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className="max-w-[65%] truncate rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600"
              title={product.category}
            >
              {product.category}
            </span>

            <span
              className={`flex shrink-0 items-center gap-1 text-[11px] font-semibold ${
                inStock
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              {inStock ? (
                <>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />

                  In stock
                </>
              ) : (
                <>
                  <PackageX
                    size={11}
                    aria-hidden="true"
                  />

                  Out of stock
                </>
              )}
            </span>
          </div>

          <h2 className="mb-3 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h2>

          <div className="mt-auto">
            <p className="text-lg font-extrabold text-slate-900">
              {lkrFormatter.format(product.price)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;