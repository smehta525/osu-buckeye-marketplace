export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  postedDate: string;
  imageUrl: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: string;
  itemCount: number;
  cartTotal: number;
  items: CartItem[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthUser {
  token: string;
  refreshToken: string;
  email: string;
  name: string;
  role: string;
}

export interface OrderItem {
  productId: number;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  shippingAddress: string;
  confirmationNumber: string;
  items: OrderItem[];
}