import { Film } from '../types';

export class Cart {
  private items: Film[] = [];

  getItems(): Film[] {
    return [...this.items]; // возвращаем копию
  }

  addItem(item: Film) {
    if (!this.items.find(f => f.id === item.id)) {
      this.items.push(item);
    }
  }

  removeItem(itemId: string) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.rating, 0); // цена = rating (для примера)
  }

  getCount(): number {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
