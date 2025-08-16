import { Api } from '../components/base/api';
import { Product } from '../types';

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
}
