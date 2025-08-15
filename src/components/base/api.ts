import { ProductListResponse, OrderResponse } from '../../types';
import { OrderData } from '../../models/order';
import { Product } from '../../types';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  private baseUrl: string;
  private defaultOptions: RequestInit;

  constructor(baseUrl: string, defaultOptions: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = defaultOptions;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(this.baseUrl + url, {
      ...this.defaultOptions,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.defaultOptions.headers as object),
        ...(options.headers as object),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(url: string, body: object, method: ApiPostMethods = 'POST'): Promise<T> {
    return this.request<T>(url, {
      method,
      body: JSON.stringify(body),
    });
  }

  async sendOrder(order: OrderData, items: Product[]): Promise<OrderResponse> {
    return this.post<OrderResponse>('/order', { order, items }, 'POST');
  }
}