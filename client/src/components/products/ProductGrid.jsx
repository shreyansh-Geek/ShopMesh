import ProductCard from './ProductCard';

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
        <p className="text-slate-400">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;