import type { Cart, CartItem } from "../../types/Product";
import "./CartSidebar.css";

type Props = {
  cart: Cart | null;
  loadingCart: boolean;
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onBrowse: () => void;
};

export default function CartSidebar({ cart, loadingCart, onUpdateQuantity, onRemoveItem, onClearCart, onBrowse }: Props) {
  return (
    <aside className="cart-section">
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