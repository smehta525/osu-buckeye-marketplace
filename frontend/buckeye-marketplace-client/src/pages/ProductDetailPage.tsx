import type { Product } from "../types/Product";

type Props = {
  product: Product;
  onBack: () => void;
  onAddToCart: (productId: number) => void;
};

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
}: Props) {
  return (
    <section className="product-detail-section">
      <div className="detail-actions">
        <button className="detail-button secondary-button" onClick={onBack}>
          Back to Products
        </button>
        <button
          className="detail-button primary-button"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </button>
      </div>

      <div className="product-detail-card">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-detail-image"
        />

        <div className="product-detail-content">
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Seller:</strong> {product.sellerName}
          </p>
          <p>
            <strong>Date:</strong> {product.postedDate}
          </p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}