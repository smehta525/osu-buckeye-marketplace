import type { Product } from "../../types/Product";
import "./ProductCard.css";

type Props = {
  product: Product;
  onAddToCart: (productId: number) => void;
  onViewDetails: (product: Product) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: Props) {
  return (
    <div className="product-card">
      <img className="product-image" src={product.imageUrl} alt={product.title} />

      <div className="product-content">
        <p>
          <strong>ID:</strong> {product.id}
        </p>

        <h3>{product.title}</h3>

        <p className="product-description">{product.description}</p>

        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Seller:</strong> {product.sellerName}
        </p>
        <p>
          <strong>Date:</strong> {product.postedDate}
        </p>

        <p className="product-price">${product.price.toFixed(2)}</p>

        <div className="product-buttons">
          <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
          <button onClick={() => onViewDetails(product)}>View Details</button>
        </div>
      </div>
    </div>
  );
}