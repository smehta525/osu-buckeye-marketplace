import { useEffect, useState } from "react";
import ProductList from "../components/ProductList/ProductList";
import { getProducts } from "../api/productsApi";
import type { Product } from "../types/Product";

function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products from the API.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return <ProductList products={products} />;
}

export default ProductListPage;