import type { Cart, Product } from "../types/Product";

const API_BASE = "http://localhost:5062/api";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getCart(): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart`);

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export async function addToCart(productId: number, quantity: number = 1): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to add to cart");
  }

  return response.json();
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return response.json();
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/cart/${cartItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item");
  }
}

export async function clearCart(): Promise<void> {
  const response = await fetch(`${API_BASE}/cart/clear`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart");
  }
}