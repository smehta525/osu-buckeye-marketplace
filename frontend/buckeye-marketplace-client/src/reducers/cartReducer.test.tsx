import { useReducer } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer";

const sampleCart = {
  id: 1,
  userId: "user-123",
  itemCount: 2,
  cartTotal: 30,
  items: [],
};

function CartProbe() {
  const [cart, dispatch] = useReducer(cartReducer, null);

  return (
    <div>
      <p>{cart ? `${cart.userId}:${cart.itemCount}` : "empty"}</p>
      <button onClick={() => dispatch({ type: "SET_CART", payload: sampleCart })}>Set cart</button>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Clear cart</button>
    </div>
  );
}

describe("cartReducer", () => {
  it("handles set and clear actions as a pure function", () => {
    expect(cartReducer(null, { type: "SET_CART", payload: sampleCart })).toEqual(sampleCart);
    expect(cartReducer(sampleCart, { type: "CLEAR" })).toBeNull();
  });

  it("updates reducer state through a component dispatch flow", async () => {
    const user = userEvent.setup();

    render(<CartProbe />);

    expect(screen.getByText("empty")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Set cart" }));
    expect(screen.getByText("user-123:2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear cart" }));
    expect(screen.getByText("empty")).toBeInTheDocument();
  });
});
