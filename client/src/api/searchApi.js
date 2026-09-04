// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function searchProducts(query) {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to search products');
  }

  return response.json();
}