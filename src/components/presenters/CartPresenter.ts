import { Cart } from '../models/cart';
export class CartPresenter {
    constructor(private cart: Cart) {}

    getItems() {
        return this.cart.getItems();
    }
    getTotal() {
        return this.cart.getTotal();
    }
    getCount() {
        return this.cart.getCount();
    }
    handleRemoveItem(id: string) {
        return this.cart.removeItem(id);
    }
}