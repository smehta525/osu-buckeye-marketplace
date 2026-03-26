import { useEffect, useState } from "react";
import type { Cart, Product } from "./types/Product";
import {
  addToCart,
  clearCart,
  getCart,
  getProducts,
  removeCartItem,
  updateCartItem,
} from "./api/productsApi";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import "./index.css";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadCart() {
    try {
      setLoadingCart(true);
      const data = await getCart();
      setCart(data);
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoadingCart(false);
    }
  }

  async function handleAddToCart(productId: number) {
    try {
      const updatedCart = await addToCart(productId, 1);
      setCart(updatedCart);
    } catch {
      setError("Failed to add item to cart.");
    }
  }

  async function handleUpdateQuantity(cartItemId: number, quantity: number) {
    if (quantity < 1) return;

    try {
      const updatedCart = await updateCartItem(cartItemId, quantity);
      setCart(updatedCart);
    } catch {
      setError("Failed to update quantity.");
    }
  }

  async function handleRemoveItem(cartItemId: number) {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch {
      setError("Failed to remove item.");
    }
  }

  async function handleClearCart() {
    try {
      await clearCart();
      await loadCart();
    } catch {
      setError("Failed to clear cart.");
    }
  }



  return (
    <div className="app">
      <header className="header">
        <h1>Buckeye Marketplace</h1>
        <div className="cart-summary">
          Cart Items: {cart?.itemCount ?? 0} | Total: ${cart?.cartTotal?.toFixed(2) ?? "0.00"}
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <main className="main-layout">
        <section className="content-section">
          {selectedProduct ? (
            <>
              <ProductDetailPage
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
              />

              
            </>
          ) : (
            <ProductListPage
              products={products}
              loading={loadingProducts}
              onAddToCart={handleAddToCart}
              onViewDetails={setSelectedProduct}
            />
          )}
        </section>

        <aside className="cart-section">
          <h2>Your Cart</h2>

          {loadingCart ? (
            <p>Loading cart...</p>
          ) : cart && cart.items.length > 0 ? (
            <>
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <h4>{item.productName}</h4>
                  <p>
                    <strong>Cart Item ID:</strong> {item.id}
                  </p>
                  <p>${item.unitPrice.toFixed(2)} each</p>
                  <p>Subtotal: ${item.subtotal.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              ))}

              <button className="clear-cart-button" onClick={handleClearCart}>
                Clear Cart
              </button>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </aside>
      </main>
    </div>
  );
}