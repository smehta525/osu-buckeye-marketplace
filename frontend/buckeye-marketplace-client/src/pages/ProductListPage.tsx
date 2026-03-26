import ProductCard from "../components/ProductCard/ProductCard";
import type { Product } from "../types/Product";

type Props = {
  products: Product[];
  loading: boolean;
  onAddToCart: (productId: number) => void;
  onViewDetails: (product: Product) => void;
};

export default function ProductListPage({
  products,
  loading,
  onAddToCart,
  onViewDetails,
}: Props) {
  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="products-section">
      <h2>Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}