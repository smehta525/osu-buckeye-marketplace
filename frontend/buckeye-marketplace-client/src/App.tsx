import { useEffect, useReducer, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
import type { Cart, Product } from "./types/Product";
import { addToCart, clearCart, getCart, getProducts, removeCartItem, updateCartItem } from "./api/productsApi";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CartSidebar from "./components/CartSidebar/CartSidebar";
import Toast from "./components/Toast/Toast";
import { cartReducer } from "./reducers/cartReducer.ts";
import "./index.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

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
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: "SET_CART", payload: null as any });
      setLoadingCart(false);
    }
  }, [user]);

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
      // Cart might not exist yet for new users, that's ok
      dispatch({ type: "SET_CART", payload: { id: 0, userId: "", itemCount: 0, cartTotal: 0, items: [] } });
    } finally {
      setLoadingCart(false);
    }
  }

  async function handleAddToCart(productId: number) {
    if (!user) {
      navigate("/login");
      return;
    }
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

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="app">
      <header className="header">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Buckeye Marketplace
        </h1>
        <nav className="header-nav">
          {user && (
            <>
              <Link to="/orders">My Orders</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
            </>
          )}
          <div className="cart-summary">
            🛒 {cart?.itemCount ?? 0} items — ${cart?.cartTotal?.toFixed(2) ?? "0.00"}
          </div>
          {user ? (
            <div className="user-info">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
          ) : (
            <Link to="/login" className="login-link">Log In</Link>
          )}
        </nav>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage cart={cart} onOrderPlaced={loadCart} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:confirmationNumber"
              element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
          </Routes>
        </section>

        {user && (
          <CartSidebar
            cart={cart}
            loadingCart={loadingCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onBrowse={() => navigate("/")}
            onCheckout={() => navigate("/checkout")}
          />
        )}
      </main>

      <Toast message="Added to cart" visible={showToast} toastKey={toastKey} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}