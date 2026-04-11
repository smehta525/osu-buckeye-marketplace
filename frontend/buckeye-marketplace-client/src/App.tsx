import { useEffect, useReducer, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import type { Cart, Product } from "./types/Product";
import { addToCart, clearCart, getCart, getProducts, removeCartItem, updateCartItem } from "./api/productsApi";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartSidebar from "./components/CartSidebar/CartSidebar";
import Toast from "./components/Toast/Toast";
import { cartReducer } from "./reducers/cartReducer.ts";
import "./index.css";

function AppInner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, dispatch] = useReducer(cartReducer, null as Cart | null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  function triggerToast() {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(false);
    setToastKey((k) => k + 1);
    requestAnimationFrame(() => setShowToast(true));
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  }

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setProducts(await getProducts());
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadCart() {
    try {
      setLoadingCart(true);
      dispatch({ type: "SET_CART", payload: await getCart() });
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoadingCart(false);
    }
  }

  async function handleAddToCart(productId: number) {
    try {
      dispatch({ type: "SET_CART", payload: await addToCart(productId, 1) });
      triggerToast();
    } catch {
      setError("Failed to add item to cart.");
    }
  }

  async function handleUpdateQuantity(cartItemId: number, quantity: number) {
    if (quantity < 1) return;
    try {
      dispatch({ type: "SET_CART", payload: await updateCartItem(cartItemId, quantity) });
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
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Buckeye Marketplace
        </h1>
        <div className="cart-summary">
          🛒 {cart?.itemCount ?? 0} items — ${cart?.cartTotal?.toFixed(2) ?? "0.00"}
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <main className="main-layout">
        <section className="content-section">
          <Routes>
            <Route
              path="/"
              element={
                <ProductListPage
                  products={products}
                  loading={loadingProducts}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProductDetailPage
                  products={products}
                  onAddToCart={handleAddToCart}
                />
              }
            />
          </Routes>
        </section>

        <CartSidebar
          cart={cart}
          loadingCart={loadingCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onBrowse={() => navigate("/")}
        />
      </main>

      <Toast message="Added to cart" visible={showToast} toastKey={toastKey} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}