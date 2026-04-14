import type { AuthResponse, Cart, Order, Product } from "../types/Product";

const API_BASE = "http://localhost:5062/api";

function getAuthUser(): { token: string; refreshToken: string } | null {
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  return JSON.parse(stored);
}

function getToken(): string | null {
  return getAuthUser()?.token ?? null;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Refresh token logic
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const authUser = getAuthUser();
  if (!authUser?.token || !authUser?.refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: authUser.token,
        refreshToken: authUser.refreshToken,
      }),
    });

    if (!response.ok) return false;

    const data: AuthResponse = await response.json();
    localStorage.setItem("auth_user", JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRefresh(url: string, options?: RequestInit): Promise<Response> {
  let response = await fetch(url, options);

  if (response.status === 401 && getAuthUser()) {
    // Avoid multiple simultaneous refresh calls
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = tryRefreshToken();
    }

    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      // Retry with new token
      const newOptions = { ...options, headers: authHeaders() };
      response = await fetch(url, newOptions);
    }
  }

  return response;
}

// ---- Auth ----

export async function registerUser(email: string, password: string, name: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed.");
  }
  return response.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Login failed.");
  }
  return response.json();
}

// ---- Products ----

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

// ---- Cart ----

export async function getCart(): Promise<Cart> {
  const response = await fetchWithRefresh(`${API_BASE}/cart`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch cart");
  return response.json();
}

export async function addToCart(productId: number, quantity: number = 1): Promise<Cart> {
  const response = await fetchWithRefresh(`${API_BASE}/cart`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) throw new Error("Failed to add to cart");
  return response.json();
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
  const response = await fetchWithRefresh(`${API_BASE}/cart/${cartItemId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error("Failed to update cart item");
  return response.json();
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  const response = await fetchWithRefresh(`${API_BASE}/cart/${cartItemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to remove cart item");
}

export async function clearCart(): Promise<void> {
  const response = await fetchWithRefresh(`${API_BASE}/cart/clear`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to clear cart");
}

// ---- Orders ----

export async function createOrder(shippingAddress: string): Promise<Order> {
  const response = await fetchWithRefresh(`${API_BASE}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ shippingAddress }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create order.");
  }
  return response.json();
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await fetchWithRefresh(`${API_BASE}/orders/mine`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

// ---- Admin ----

export async function getAllOrders(): Promise<Order[]> {
  const response = await fetchWithRefresh(`${API_BASE}/orders`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const response = await fetchWithRefresh(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update order status");
  return response.json();
}

export async function createProduct(product: Omit<Product, "id" | "postedDate">): Promise<Product> {
  const response = await fetchWithRefresh(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(id: number, product: Omit<Product, "id" | "postedDate">): Promise<Product> {
  const response = await fetchWithRefresh(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetchWithRefresh(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete product");
}