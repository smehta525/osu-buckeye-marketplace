import type { Product } from "../../types/Product";
import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img
        className="product-card__image"
        src={product.imageUrl}
        alt={product.title}
      />

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__meta">ID: {product.id}</p>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
        <p className="product-card__meta">Category: {product.category}</p>
        <p className="product-card__meta">Seller: {product.sellerName}</p>
        <p className="product-card__meta">
          Posted: {new Date(product.postedDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;