import { Product } from '../../types';

export class Cart {
    private items: Product[] = [];
    private updateListeners: (() => void)[] = [];

    getItems(): Product[] {
        return [...this.items]; // возвращаем копию
    }

    addItem(item: Product) {
        if (!this.items.find((f) => f.id === item.id)) {
            this.items.push(item);
            this.emitUpdate();
        }
    }

    removeItem(itemId: string) {
        this.items = this.items.filter((item) => item.id !== itemId);
        this.emitUpdate();
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    clear() {
        this.items = [];
        this.emitUpdate();
    }

    hasProduct(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    onUpdate(listener: () => void) {
        this.updateListeners.push(listener);
    }

    private emitUpdate() {
        this.updateListeners.forEach((fn) => fn());
    }
}