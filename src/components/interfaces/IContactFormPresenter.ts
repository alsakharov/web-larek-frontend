export interface IContactFormPresenter {
    getEmail(): string;
    getPhone(): string;
    getFormErrors(): Record<string, string>;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    validateContactFields(): boolean;
    submitOrder(payment: string, address: string): Promise<{ success: boolean; total?: number; error?: string }>;
}