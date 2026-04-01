import type { Product } from "../../types/Product";
import "./ProductCard.css";

type Props = {
  product: Product;
  onAddToCart: (productId: number) => void;
  onViewDetails: () => void;
};

export default function ProductCard({ product, onAddToCart, onViewDetails }: Props) {
  return (
    <div className="product-card">
      <img className="product-image" src={product.imageUrl} alt={product.title} />
      <div className="product-content">
        <p className="product-id">ID: {product.id}</p>
        <span className="product-category">{product.category}</span>
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-seller">Seller: {product.sellerName}</p>
        <p className="product-date">Posted: {product.postedDate}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <div className="product-buttons">
          <button onClick={onViewDetails}>View Details</button>
          <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}