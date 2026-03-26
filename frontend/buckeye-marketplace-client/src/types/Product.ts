export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  postedDate: string;
  imageUrl: string;
};

export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  id: number;
  userId: string;
  itemCount: number;
  cartTotal: number;
  items: CartItem[];
};