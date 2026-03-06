import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/productsApi";
import type { Product } from "../types/Product";

function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id || Number.isNaN(productId)) {
        setError("ERROR: Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("ERROR 404: Failed to load product:", err);
        setError("ERROR 404: Product not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, productId]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link to="/products" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Back to products
      </Link>

      <h1>{product.title}</h1>
      <p><strong>ID:</strong> {product.id}</p>

      <img
        src={product.imageUrl}
        alt={product.title}
        style={{ width: "100%", maxWidth: 700, borderRadius: 12 }}
      />

      <p style={{ marginTop: 16 }}>{product.description}</p>

      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Seller:</strong> {product.sellerName}</p>
      <p>
        <strong>Posted:</strong>{" "}
        {new Date(product.postedDate).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ProductDetailPage;