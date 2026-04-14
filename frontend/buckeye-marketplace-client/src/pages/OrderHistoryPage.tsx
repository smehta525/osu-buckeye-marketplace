import { useEffect, useState } from "react";
import { getMyOrders } from "../api/productsApi";
import type { Order } from "../types/Product";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span><strong>#{order.confirmationNumber}</strong></span>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p className="order-date">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.productTitle} × {item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: <strong>${order.total.toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}