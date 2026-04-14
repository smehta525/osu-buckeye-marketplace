import { useRef, useState } from "react";
import type { Cart, CartItem } from "../../types/Product";
import "./CartSidebar.css";

type Props = {
  cart: Cart | null;
  loadingCart: boolean;
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onBrowse: () => void;
  onCheckout?: () => void;
};

export default function CartSidebar({ cart, loadingCart, onUpdateQuantity, onRemoveItem, onClearCart, onBrowse, onCheckout }: Props) {
  const [width, setWidth] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(280);

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = width;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      const newWidth = Math.min(500, Math.max(200, startWidth.current + delta));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      dragging.current = false;
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  return (
    <aside className={`cart-section ${isDragging ? "dragging" : ""}`} style={{ width }}>
      <div className="cart-dragger" onMouseDown={onMouseDown} title="Drag to resize" />

      <h2>Your Cart</h2>

      {loadingCart ? (
        <p>Loading cart...</p>
      ) : cart && cart.items.length > 0 ? (
        <>
          {cart.items.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <h4>{item.productName}</h4>
              <p>${item.unitPrice.toFixed(2)} × {item.quantity} = ${item.subtotal.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-button" onClick={() => onRemoveItem(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total"><strong>Total: ${cart.cartTotal.toFixed(2)}</strong></div>
          {onCheckout && (
            <button className="checkout-button" onClick={onCheckout}>Checkout</button>
          )}
          <button className="clear-cart-button" onClick={onClearCart}>Clear Cart</button>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="browse-button" onClick={onBrowse}>Browse Products</button>
        </div>
      )}
    </aside>
  );
}