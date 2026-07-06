import { Link } from 'react-router';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ProductCard({ product }) {
  const inStock = product.stock > 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      aria-label={`View ${product.name}`}
    >
      <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {product.category}
            </span>

            <span
              className={`text-xs font-semibold ${
                inStock ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
            {product.name}
          </h2>

          <p className="mt-4 text-xl font-bold text-slate-950">
            {priceFormatter.format(product.price)}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
