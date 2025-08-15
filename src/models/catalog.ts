import { Api } from '../components/base/api';
import { Product } from '../types';

interface OrderRequest {
  items: string[];
  address: string;
  email: string;
}

interface OrderResponse {
  id: string;
  total: number;
}

export class Catalog {
  constructor(protected api: Api) {}

  // Получить все товары (массив)
  async getProducts(): Promise<Product[]> {
    return await this.api.getProducts();
  }

  // Получить один товар по id
  async getProduct(id: string): Promise<Product> {
    return this.api.get<Product>(`/product/${id}`); 
  }

  // Оформить заказ
  async orderItems(order: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order', order);
  }
}