export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  price: number;
}

export interface ProductListResponse {
  total: number;
  items: Product[];
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}