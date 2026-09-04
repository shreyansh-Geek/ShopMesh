export function adaptSearchProduct(product) {
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    category: product.category,

    store: {
      id: product.store_id,
      name: product.store_name,
    },

    pricing: {
      price: product.price,
      mrp: product.mrp,
      currency: product.currency,
    },

    rating: {
      value: product.rating,
      count: product.rating_count,
    },

    image: product.image,
    url: product.url,

    availability: product.availability,

    metadata: {},
  };
}