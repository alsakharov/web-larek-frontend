import { Product } from '../types';
import { Catalog } from '../models/catalog';
import { Api } from '../components/base/api';
import { ModalView } from './ModalView';
import { Cart } from '../models/cart';

export class ProductListView {
  constructor(
    private catalog: Catalog,
    private api: Api,
    private cart: Cart,
    private productModal: ModalView,
    private gallery: HTMLElement,
    private cardTemplate: HTMLTemplateElement,
    private openProductModal: (productId: string) => void
  ) {}

  async render() {
    const products = await this.catalog.getProducts();
    const categoryMap: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button'
    };

    this.gallery.innerHTML = '';
    products.forEach(product => {
      const card = this.cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const categorySpan = card.querySelector('.card__category');
      const titleH2 = card.querySelector('.card__title');
      const img = card.querySelector('.card__image') as HTMLImageElement;
      const priceSpan = card.querySelector('.card__price');

      let categoryClass = 'card__category_other';
      if (product.category && categoryMap[product.category]) {
        categoryClass = `card__category_${categoryMap[product.category]}`;
      }

      if (categorySpan) {
        categorySpan.textContent = product.category || 'Без категории';
        categorySpan.className = `card__category ${categoryClass}`;
      }
      if (titleH2) titleH2.textContent = product.title;
      if (img) img.src = product.image.startsWith('http') ? product.image : `${this.api.cdnUrl}/${product.image}`;
      if (priceSpan) priceSpan.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
      card.addEventListener('click', () => this.openProductModal(product.id));
      this.gallery.appendChild(card);
    });
  }
}