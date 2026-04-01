import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import type { Product } from "../types/Product";

type Props = {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: number) => void;
};

export default function ProductListPage({ products, loading, onAddToCart }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (loading) return <p className="status-message">Loading products...</p>;
  if (products.length === 0) return <p className="status-message">No products available.</p>;

  return (
    <section className="products-section">
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </section>
  );
}