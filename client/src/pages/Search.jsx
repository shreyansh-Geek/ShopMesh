import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import products from '../data/products';
import {
  getUniqueBrands,
  getUniqueStores,
  filterAndSortProducts,
} from '../utils/productUtils';

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  const [selectedStore, setSelectedStore] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const stores = useMemo(
  () => getUniqueStores(products),
  []
);

const brands = useMemo(
  () => getUniqueBrands(products),
  []
);

const filteredProducts = useMemo(
  () =>
    filterAndSortProducts(products, {
      selectedStore,
      selectedBrand,
      maxPrice,
      minRating,
      sortBy,
    }),
  [
    selectedStore,
    selectedBrand,
    maxPrice,
    minRating,
    sortBy,
  ]
);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-8">
        <p className="text-sm text-slate-500">
          Search results for
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          "{query}"
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {filteredProducts.length} products found
        </p>
      </div>

      <ProductFilters
        stores={stores}
        brands={brands}
        selectedStore={selectedStore}
        selectedBrand={selectedBrand}
        maxPrice={maxPrice}
        minRating={minRating}
        sortBy={sortBy}
        onStoreChange={setSelectedStore}
        onBrandChange={setSelectedBrand}
        onMaxPriceChange={setMaxPrice}
        onMinRatingChange={setMinRating}
        onSortChange={setSortBy}
      />

      <ProductGrid products={filteredProducts} />

    </section>
  );
}

export default Search;