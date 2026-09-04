function ProductFilters({
  stores,
  brands,
  selectedStore,
  selectedBrand,
  maxPrice,
  minRating,
  sortBy,
  onStoreChange,
  onBrandChange,
  onMaxPriceChange,
  onMinRatingChange,
  onSortChange,
}) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">

        {/* Store */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Store
          </label>

          <select
            value={selectedStore}
            onChange={(event) => onStoreChange(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All stores</option>

            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Brand
          </label>

          <select
            value={selectedBrand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All brands</option>

            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Maximum price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Max price
          </label>

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="No limit"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Minimum rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Minimum rating
          </label>

          <select
            value={minRating}
            onChange={(event) => onMinRatingChange(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Any rating</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sort by
          </label>

          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating-high">Rating: High to Low</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default ProductFilters;