import { useParams, Link } from "react-router-dom";

export default function OrderConfirmationPage() {
  const { confirmationNumber } = useParams();

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <h2>Order Confirmed!</h2>
        <p>Your order has been placed successfully.</p>
        <p className="confirmation-number">
          Confirmation #: <strong>{confirmationNumber}</strong>
        </p>
        <div className="confirmation-links">
          <Link to="/orders">View My Orders</Link>
          <Link to="/">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}