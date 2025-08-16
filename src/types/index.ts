export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  price: number | null;
}

export interface ProductListResponse {
  total: number;
  items: Product[];
}

export interface OrderResponse {
  id: string;
  total: number;
  error?: string;
}

export interface OrderData {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
}

export type FormErrors = {
  address?: string;
  payment?: string;
  email?: string;
  phone?: string;
};

