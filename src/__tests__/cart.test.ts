import { Cart } from '../models/cart';
import { Product } from '../types';

const product: Product = {
    id: '1',
    title: 'Тестовый товар',
    price: 100,
    image: 'test.jpg',
    description: 'Описание товара'
};

describe('Cart', () => {
    let cart: Cart;

    beforeEach(() => {
        cart = new Cart();
    });

    test('добавляет товар', () => {
        cart.addItem(product);
        expect(cart.getItems()).toHaveLength(1);
    });

    test('не добавляет одинаковый товар дважды', () => {
        cart.addItem(product);
        cart.addItem(product);
        expect(cart.getItems()).toHaveLength(1);
    });

    test('удаляет товар', () => {
        cart.addItem(product);
        cart.removeItem(product.id);
        expect(cart.getItems()).toHaveLength(0);
    });

    test('очищает корзину', () => {
        cart.addItem(product);
        cart.clear();
        expect(cart.getItems()).toHaveLength(0);
    });

    test('считает сумму', () => {
        cart.addItem(product);
        expect(cart.getTotal()).toBe(100);
    });
});