import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../types/Product";

type Props = {
  products: Product[];
  onAddToCart: (productId: number) => void;
  successMessage: string;
};

export default function ProductDetailPage({ products, onAddToCart, successMessage }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p className="status-message">Product not found.</p>;

  return (
    <section className="product-detail-section">
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button className="back-button" onClick={() => navigate("/")}>← Back to Products</button>

      <div className="product-detail-card">
        <img src={product.imageUrl} alt={product.title} className="product-detail-image" />
        <div className="product-detail-content">
          <span className="product-category">{product.category}</span>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p><strong>Seller:</strong> {product.sellerName}</p>
          <p><strong>Posted:</strong> {product.postedDate}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <button className="add-to-cart-button" onClick={() => onAddToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}