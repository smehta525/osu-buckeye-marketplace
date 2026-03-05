import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { getProductById } from "../api/productsApi";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setError("Invalid product id.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (e: unknown) {
        if ((e as Error)?.message === "NOT_FOUND") setError("Product not found (404).");
        else setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) return <p>Loading product details...</p>;

  if (error) {
    return (
      <div>
        <Link to="/products">← Back to Products</Link>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) return <p>No product data available.</p>;

  return (
    <div>
      <Link to="/products">← Back to Products</Link>
      <h1>{product.title}</h1>

      <img
        src={product.imageUrl}
        alt={product.title}
        style={{ width: "100%", maxWidth: 900, borderRadius: 10, marginTop: 10 }}
      />

      <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Seller:</strong> {product.sellerName}</p>
        <p><strong>Posted Date:</strong> {product.postedDate}</p>
      </div>
    </div>
  );
}