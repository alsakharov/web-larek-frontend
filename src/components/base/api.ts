// --- Импорт типов ---
import {
	Product,
	ProductListResponse,
	OrderResponse,
	OrderData,
} from '../../types';

// --- Типы для методов POST ---
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// --- Класс для работы с API и CDN ---
export class Api {
	public cdnUrl: string;
	public apiUrl: string;
	private defaultOptions: RequestInit;

	constructor(
		cdnUrl: string,
		apiUrl: string,
		defaultOptions: RequestInit = {}
	) {
		this.cdnUrl = cdnUrl;
		this.apiUrl = apiUrl;
		this.defaultOptions = defaultOptions;
	}

	getCdnUrl(): string {
		return this.cdnUrl;
	}

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

	get<T>(url: string): Promise<T> {
		return this.request<T>(url, { method: 'GET' });
	}

	post<T>(
		url: string,
		body: object,
		method: ApiPostMethods = 'POST'
	): Promise<T> {
		return this.request<T>(url, {
			method,
			body: JSON.stringify(body),
		});
	}

	async getProducts(): Promise<Product[]> {
		const response = await this.get<ProductListResponse>('/product');
		return response.items;
	}

	// --- Отправить заказ ---
	async sendOrder(
		order: OrderData,
		items: { productId: string; quantity: number }[]
	): Promise<OrderResponse> {
		// Собираем payload для сервера
		const payload = {
			payment: order.payment,
			address: order.address,
			email: order.email,
			phone: order.phone,
			total: order.total,
			items: items.map((item) => item.productId),
		};
		return this.post<OrderResponse>('/order', payload, 'POST');
	}
}
