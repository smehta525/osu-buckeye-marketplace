import type { Cart } from "../types/Product";

export type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "CLEAR" };

export function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  switch (action.type) {
    case "SET_CART":
      return action.payload;
    case "CLEAR":
      return null;
    default:
      return state;
  }
}
