import type { Product } from "../../types/Product";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

type ProductListProps = {
  products: Product[];
};

function ProductList({ products }: ProductListProps) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;