import { Api } from './api';
import { Product, ProductListResponse, OrderResponse } from '../../types';

export class LarekApi {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    getCdnUrl(): string {
        return this.api.getCdnUrl();
    }

    async getProducts(): Promise<Product[]> {
        const response = await this.api.get<ProductListResponse>('/product');
        return response.items;
    }

    async getProduct(id: string): Promise<Product> {
        return this.api.get<Product>(`/product/${id}`);
    }

    // Теперь метод принимает готовый объект заказа и просто отправляет его
    async sendOrder(orderPayload: object): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('/order', orderPayload, 'POST');
    }
}