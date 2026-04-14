import {
  addToCart,
  clearCart,
  getCart,
  getProducts,
  removeCartItem,
  updateCartItem,
} from "../productsApi";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("productsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock localStorage so auth headers don't break tests
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
  });

  it("getProducts returns product list when request is successful", async () => {
    const payload = [{ id: 1, title: "Heels" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await getProducts();

    expect(fetch).toHaveBeenCalledWith("http://localhost:5062/api/products");
    expect(result).toEqual(payload);
  });

  it("getProducts throws when request is unsuccessful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

    await expect(getProducts()).rejects.toThrow("Failed to fetch products");
  });

  it("getCart throws when request is unsuccessful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);

    await expect(getCart()).rejects.toThrow("Failed to fetch cart");
  });

  it("addToCart posts payload and returns cart", async () => {
    const cart = { id: 1, userId: "default-user", itemCount: 1, cartTotal: 15, items: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => cart,
    } as Response);

    const result = await addToCart(3, 2);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5062/api/cart", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ productId: 3, quantity: 2 }),
    }));
    expect(result).toEqual(cart);
  });

  it("updateCartItem sends put request and returns cart", async () => {
    const cart = { id: 1, userId: "default-user", itemCount: 2, cartTotal: 30, items: [] };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => cart,
    } as Response);

    const result = await updateCartItem(8, 4);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5062/api/cart/8", expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ quantity: 4 }),
    }));
    expect(result).toEqual(cart);
  });

  it("removeCartItem sends delete request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    await removeCartItem(7);

    expect(fetch).toHaveBeenCalledWith("http://localhost:5062/api/cart/7", expect.objectContaining({
      method: "DELETE",
    }));
  });

  it("clearCart sends delete request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    await clearCart();

    expect(fetch).toHaveBeenCalledWith("http://localhost:5062/api/cart/clear", expect.objectContaining({
      method: "DELETE",
    }));
  });
});