import { Catalog } from '../models/catalog';
import { ProductListView } from '../views/ProductListView';
import { LarekApi } from '../base/LarekApi';
import { Product } from '../../types';

export class ProductListPresenter {
    constructor(
        private catalog: Catalog,
        private view: ProductListView,
        private api: LarekApi
    ) {
        // Подписка на событие обновления модели
        this.catalog.onUpdate(() => this.render());
    }

    async fetchAndRender() {
        const products: Product[] = await this.api.getProducts(); // запрос к серверу
        this.catalog.setProducts(products); // сохраняем в модель
        // onUpdate вызовет this.render()
    }

    render() {
        const products = this.catalog.getProducts();
        this.view.render(products);
    }
}