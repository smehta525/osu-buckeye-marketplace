import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
} from "../api/productsApi";
import type { Product, Order } from "../types/Product";

type Tab = "products" | "orders";

interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  sellerName: string;
  imageUrl: string;
}

const emptyForm: ProductForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  sellerName: "",
  imageUrl: "",
};

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([getProducts(), getAllOrders()]);
      setProducts(p);
      setOrders(o);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product: Product) {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sellerName: product.sellerName,
      imageUrl: product.imageUrl,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function handleNewProduct() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSubmitProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      sellerName: form.sellerName,
      imageUrl: form.imageUrl,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      const updated = await getProducts();
      setProducts(updated);
    } catch {
      setError("Failed to save product.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete product.");
    }
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
    } catch {
      setError("Failed to update order status.");
    }
  }

  if (loading) return <p>Loading admin data...</p>;

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      {error && <p className="auth-error">{error}</p>}

      <div className="admin-tabs">
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
      </div>

      {tab === "products" && (
        <div className="admin-section">
          <button className="admin-add-btn" onClick={handleNewProduct}>
            + Add Product
          </button>

          {showForm && (
            <form onSubmit={handleSubmitProduct} className="admin-form">
              <h3>{editingId ? "Edit Product" : "New Product"}</h3>
              <label>
                Title
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </label>
              <label>
                Price
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </label>
              <label>
                Category
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </label>
              <label>
                Seller Name
                <input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} required />
              </label>
              <label>
                Image URL
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </label>
              <div className="admin-form-actions">
                <button type="submit">{editingId ? "Save Changes" : "Create"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              </div>
            </form>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-section">
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span><strong>#{order.confirmationNumber}</strong></span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <p className="order-date">
                  {new Date(order.orderDate).toLocaleDateString()} — {order.shippingAddress}
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
      )}
    </div>
  );
}