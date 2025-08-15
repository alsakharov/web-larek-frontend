import { Api } from '../components/base/api';
import { Product, ProductListResponse } from '../types';

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

  async getProducts(): Promise<Product[]> {
    const response = await this.api.get<ProductListResponse>('/');
    return response.items;
  }

  async getProduct(id: string): Promise<Product> {
    return this.api.get<Product>(`/${id}`);
  }

  async orderItems(order: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order', order);
  }
}
