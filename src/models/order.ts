export interface OrderData {
    paymentType: string;
    address: string;
    email: string;
    phone: string;
}

export class Order {
    private data: Partial<OrderData> = {};

    setPaymentType(type: string) {
        this.data.paymentType = type;
    }

    setAddress(address: string) {
        this.data.address = address;
    }

    setEmail(email: string) {
        this.data.email = email;
    }

    setPhone(phone: string) {
        this.data.phone = phone;
    }

    getData(): Partial<OrderData> {
        return { ...this.data };
    }

    clear() {
        this.data = {};
    }
}