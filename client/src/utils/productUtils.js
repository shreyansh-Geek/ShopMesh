export function getUniqueStores(products) {
  return [
    ...new Map(
      products.map((product) => [
        product.store.id,
        product.store.name,
      ])
    ).values(),
  ];
}

export function getUniqueBrands(products) {
  return [...new Set(products.map((product) => product.brand))];
}

export function filterAndSortProducts(
  products,
  {
    selectedStore = '',
    selectedBrand = '',
    maxPrice = '',
    minRating = '',
    sortBy = 'relevance',
  }
) {
  let result = [...products];

  if (selectedStore) {
    result = result.filter(
      (product) => product.store.name === selectedStore
    );
  }

  if (selectedBrand) {
    result = result.filter(
      (product) => product.brand === selectedBrand
    );
  }

  if (maxPrice) {
    result = result.filter(
      (product) => product.pricing.price <= Number(maxPrice)
    );
  }

  if (minRating) {
    result = result.filter(
      (product) => product.rating.value >= Number(minRating)
    );
  }

  if (sortBy === 'price-low') {
    result.sort(
      (a, b) => a.pricing.price - b.pricing.price
    );
  }

  if (sortBy === 'price-high') {
    result.sort(
      (a, b) => b.pricing.price - a.pricing.price
    );
  }

  if (sortBy === 'rating-high') {
    result.sort(
      (a, b) => b.rating.value - a.rating.value
    );
  }

  return result;
}