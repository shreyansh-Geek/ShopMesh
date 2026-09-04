import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';

import {
  getUniqueBrands,
  getUniqueStores,
  filterAndSortProducts,
} from '../utils/productUtils';

import { searchProducts } from '../api/searchApi';
import { adaptSearchProduct } from '../utils/productAdapter';

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedStore, setSelectedStore] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (!query) {
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await searchProducts(query);

        if (cancelled) {
          return;
        }

        const adaptedProducts = data.products.map(
          adaptSearchProduct
        );

        setProducts(adaptedProducts);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);

        setProducts([]);
        setError('Unable to load products.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const stores = useMemo(
    () => getUniqueStores(products),
    [products]
  );

  const brands = useMemo(
    () => getUniqueBrands(products),
    [products]
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
      products,
      selectedStore,
      selectedBrand,
      maxPrice,
      minRating,
      sortBy,
    ]
  );

  const showResults = Boolean(query) && !loading && !error;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-8">
        <p className="text-sm text-slate-500">
          Search results for
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          "{query}"
        </h1>

        {showResults && (
          <p className="mt-2 text-sm text-slate-400">
            {filteredProducts.length} products found
          </p>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <p className="text-slate-400">
            Searching across stores...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      )}

      {showResults && (
        <>
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
        </>
      )}

    </section>
  );
}

export default Search;
