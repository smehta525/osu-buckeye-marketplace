import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "./ProductCard";

const product = {
  id: 11,
  title: "Desk Lamp",
  description: "LED lamp",
  price: 35,
  category: "Furniture",
  sellerName: "Lena T.",
  postedDate: "2026-03-03",
  imageUrl: "https://example.com/lamp.png",
};

describe("ProductCard", () => {
  it("renders product details and formatted price", () => {
    render(<ProductCard product={product} onAddToCart={vi.fn()} onViewDetails={vi.fn()} />);

    expect(screen.getByRole("img", { name: "Desk Lamp" })).toHaveAttribute("src", product.imageUrl);
    expect(screen.getByText("ID: 11")).toBeInTheDocument();
    expect(screen.getByText("Furniture")).toBeInTheDocument();
    expect(screen.getByText("Seller: Lena T.")).toBeInTheDocument();
    expect(screen.getByText("Posted: 2026-03-03")).toBeInTheDocument();
    expect(screen.getByText("$35.00")).toBeInTheDocument();
  });

  it("calls the action callbacks", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    const onViewDetails = vi.fn();

    render(<ProductCard product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />);

    await user.click(screen.getByRole("button", { name: "View Details" }));
    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(onViewDetails).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(11);
  });
});
