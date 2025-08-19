export interface IOrderFormPresenter {
    getAddress(): string;
    getPayment(): string;
    getFormErrors(): Record<string, string>;
    setPayment(payment: string): void;
    setOrderAddress(address: string): void;
    validateOrder(): boolean;
    onNextStep(payment: string, address: string): void;
}