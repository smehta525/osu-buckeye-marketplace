import { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import type { Cart, Product } from "./types/Product";
import { addToCart, clearCart, getCart, getProducts, removeCartItem, updateCartItem } from "./api/productsApi";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartSidebar from "./components/CartSidebar/CartSidebar";
import "./index.css";

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "CLEAR" };

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  switch (action.type) {
    case "SET_CART": return action.payload;
    case "CLEAR": return null;
    default: return state;
  }
}

function AppInner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, dispatch] = useReducer(cartReducer, null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  function showSuccess(msg: string) {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 2500);
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
      showSuccess("Item added to cart!");
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
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Buckeye Marketplace</h1>
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
                  successMessage={successMessage}
                />
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProductDetailPage
                  products={products}
                  onAddToCart={handleAddToCart}
                  successMessage={successMessage}
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