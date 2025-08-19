import { IContactFormPresenter } from '../interfaces/IContactFormPresenter';
import { FormModel } from '../models/FormModel';
import { Cart } from '../models/cart';
import { LarekApi } from '../base/LarekApi';

export function createContactFormPresenter(
    formModel: FormModel,
    cart: Cart,
    larekApi: LarekApi
): IContactFormPresenter {
    return {
        getEmail: () => formModel.email,
        getPhone: () => formModel.phone,
        getFormErrors: () => formModel.formErrors,
        setEmail: (email: string) => formModel.setEmail(email),
        setPhone: (phone: string) => formModel.setPhone(phone),
        validateContactFields: () => formModel.validateContactFields(),
        async submitOrder(payment: string, address: string) {
            const orderPayload = {
                payment,
                address,
                email: formModel.email,
                phone: formModel.phone,
                total: cart.getTotal(),
                items: cart.getItems().map((item) => item.id),
            };
            try {
                const response = await larekApi.sendOrder(orderPayload);
                if (response.id) {
                    cart.clear();
                    formModel.clear();
                    return { success: true, total: response.total };
                } else {
                    return { success: false, error: response.error || 'Ошибка при оформлении заказа' };
                }
            } catch {
                return { success: false, error: 'Ошибка при оформлении заказа' };
            }
        }
    };
}