function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="aspect-square bg-slate-800">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.store.name}
          </span>

          <span className="text-sm text-slate-400">
            ★ {product.rating.value}
          </span>
        </div>

        <h2 className="line-clamp-2 text-base font-semibold text-white">
          {product.title}
        </h2>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-white">
              ₹{product.pricing.price.toLocaleString('en-IN')}
            </p>

            {product.pricing.mrp && (
  <p className="text-sm text-slate-500 line-through">
    ₹{product.pricing.mrp.toLocaleString('en-IN')}
  </p>
)}
          </div>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            View
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;