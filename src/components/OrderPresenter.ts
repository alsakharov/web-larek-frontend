import { FormModel } from '../models/FormModel';
import { Cart } from '../models/cart';
import { LarekApi } from './base/LarekApi';
import { Product } from '../types';

export class OrderPresenter {
    constructor(
        private formModel: FormModel,
        private cart: Cart,
        private api: LarekApi
    ) {}

    getCartItems(): Product[] {
        return this.cart.getItems();
    }

    getCartTotal(): number {
        return this.cart.getTotal();
    }

    getCartCount(): number {
        return this.cart.getCount();
    }

    setPayment(payment: string) {
        this.formModel.setPayment(payment);
    }

    setOrderAddress(address: string) {
        this.formModel.setOrderAddress(address);
    }

    setEmail(email: string) {
        this.formModel.setEmail(email);
    }

    setPhone(phone: string) {
        this.formModel.setPhone(phone);
    }

    getFormErrors() {
        return this.formModel.formErrors;
    }

    getPayment() {
        return this.formModel.payment;
    }

    getAddress() {
        return this.formModel.address;
    }

    getEmail() {
        return this.formModel.email;
    }

    getPhone() {
        return this.formModel.phone;
    }

    async sendOrder(payload: any) {
        return await this.api.sendOrder(payload);
    }

    clearCart() {
        this.cart.clear();
    }

    clearForm() {
        this.formModel.clear();
    }
}