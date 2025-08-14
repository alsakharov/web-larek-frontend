import { Order } from '../models/order';

describe('Order', () => {
    let order: Order;

    beforeEach(() => {
        order = new Order();
    });

    test('устанавливает способ оплаты', () => {
        order.setPaymentType('card');
        expect(order.getData().paymentType).toBe('card');
    });

    test('устанавливает адрес', () => {
        order.setAddress('Москва');
        expect(order.getData().address).toBe('Москва');
    });

    test('устанавливает email', () => {
        order.setEmail('test@mail.ru');
        expect(order.getData().email).toBe('test@mail.ru');
    });

    test('устанавливает телефон', () => {
        order.setPhone('123456');
        expect(order.getData().phone).toBe('123456');
    });

    test('очищает заказ', () => {
        order.setPaymentType('card');
        order.clear();
        expect(order.getData().paymentType).toBeUndefined();
    });
});