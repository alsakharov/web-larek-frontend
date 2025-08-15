// --- Импорт типов ---
import { Product, ProductListResponse, OrderResponse } from '../../types';
import { OrderData } from '../../models/order';

// --- Типы для методов POST ---
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// --- Класс для работы с API и CDN ---
export class Api {
  // --- Публичные свойства для CDN и API адресов ---
  public cdnUrl: string;
  public apiUrl: string;
  private defaultOptions: RequestInit;

  // --- Конструктор: принимает CDN, API и опции запроса ---
  constructor(cdnUrl: string, apiUrl: string, defaultOptions: RequestInit = {}) {
    this.cdnUrl = cdnUrl;
    this.apiUrl = apiUrl;
    this.defaultOptions = defaultOptions;
  }

  // --- Получить адрес CDN ---
  getCdnUrl(): string {
    return this.cdnUrl;
  }

  // --- Универсальный приватный метод для HTTP-запросов ---
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(this.apiUrl + url, {
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

  // --- Метод для GET-запросов ---
  get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  // --- Метод для POST/PUT/DELETE-запросов ---
  post<T>(url: string, body: object, method: ApiPostMethods = 'POST'): Promise<T> {
    return this.request<T>(url, {
      method,
      body: JSON.stringify(body),
    });
  }

  // --- Получить список товаров как массив ---
  async getProducts(): Promise<Product[]> {
  const response = await this.get<ProductListResponse>('/product');
  return response.items; // теперь вернётся массив товаров
}

  // --- Отправить заказ ---
  async sendOrder(order: OrderData, items: Product[]): Promise<OrderResponse> {
    return this.post<OrderResponse>('/order', { order, items }, 'POST');
  }
}