import { Cart } from '../models/cart';
import { Product } from '../types';
import { CartView } from './CartView';

export class CartPresenter {
    public view?: CartView;

    constructor(
        private cart: Cart,
        view?: CartView
    ) {
        if (view) {
            this.view = view;
            this.view.setPresenter(this);
        }
    }

    setView(view: CartView) {
        this.view = view;
        this.view.setPresenter(this);
    }

    getItems(): Product[] {
        return this.cart.getItems();
    }

    getTotal(): number {
        return this.cart.getTotal();
    }

    getCount(): number {
        return this.cart.getCount();
    }

    handleRemoveItem(id: string) {
        this.cart.removeItem(id);
        this.view?.update();
    }

    addItem(product: Product) {
        this.cart.addItem(product);
        this.view?.update();
    }
}