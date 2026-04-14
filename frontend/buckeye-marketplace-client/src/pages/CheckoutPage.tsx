import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/productsApi";
import type { Cart } from "../types/Product";

interface Props {
  cart: Cart | null;
  onOrderPlaced: () => void;
}

export default function CheckoutPage({ cart, onOrderPlaced }: Props) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!address.trim()) {
      setError("Please enter a shipping address.");
      return;
    }
    try {
      setLoading(true);
      const order = await createOrder(address);
      onOrderPlaced();
      navigate(`/order-confirmation/${order.confirmationNumber}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/")}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {error && <p className="auth-error">{error}</p>}

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.id} className="checkout-item">
            <span>{item.productName} × {item.quantity}</span>
            <span>${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-total">
          <strong>Total: ${cart.cartTotal.toFixed(2)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Shipping Address
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Enter your full shipping address"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}