import { Product } from '../../types';

export class Catalog {
    private products: Product[] = [];
    private updateListeners: (() => void)[] = [];

    setProducts(products: Product[]) {
        this.products = products;
        this.emitUpdate();
    }

    getProducts(): Product[] {
        return this.products;
    }

    getProduct(id: string): Product | undefined {
        return this.products.find((p) => p.id === id);
    }

    onUpdate(listener: () => void) {
        this.updateListeners.push(listener);
    }

    private emitUpdate() {
        this.updateListeners.forEach((fn) => fn());
    }
}