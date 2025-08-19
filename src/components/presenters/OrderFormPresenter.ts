import { IOrderFormPresenter } from '../interfaces/IOrderFormPresenter';
import { FormModel } from '../models/FormModel';

export function createOrderFormPresenter(
    formModel: FormModel,
    onNextStep: (payment: string, address: string) => void
): IOrderFormPresenter {
    return {
        getAddress: () => formModel.address,
        getPayment: () => formModel.payment,
        getFormErrors: () => formModel.formErrors,
        setPayment: (payment: string) => formModel.setPayment(payment),
        setOrderAddress: (address: string) => formModel.setOrderAddress(address),
        validateOrder: () => formModel.validateOrder(),
        onNextStep: (payment: string, address: string) => onNextStep(payment, address)
    };
}