import { Product } from '../types';

export class Cart {
  private items: Product[] = [];

  getItems(): Product[] {
    return [...this.items]; // возвращаем копию
  }

  addItem(item: Product) {
    if (!this.items.find(f => f.id === item.id)) {
      this.items.push(item);
    }
  }

  removeItem(itemId: string) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

getTotal(): number {
  return this.items.reduce((sum, item) => sum + item.price, 0);
}


  getCount(): number {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
