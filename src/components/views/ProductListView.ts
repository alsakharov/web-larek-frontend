import { Product } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductListView {
    constructor(
        private gallery: HTMLElement,
        private cardTemplate: HTMLTemplateElement,
        private cdnUrl: string,
        private emitter: EventEmitter
    ) {}

    render(products: Product[]) {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            другое: 'other',
            дополнительное: 'additional',
            кнопка: 'button',
        };

        this.gallery.innerHTML = '';
        products.forEach((product) => {
            const card = this.cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

            // Все элементы ищутся только внутри карточки
            const categorySpan = card.querySelector('.card__category') as HTMLElement;
            const titleH2 = card.querySelector('.card__title') as HTMLElement;
            const img = card.querySelector('.card__image') as HTMLImageElement;
            const priceSpan = card.querySelector('.card__price') as HTMLElement;

            let categoryClass = 'card__category_other';
            if (product.category && categoryMap[product.category]) {
                categoryClass = `card__category_${categoryMap[product.category]}`;
            }

            if (categorySpan) {
                categorySpan.textContent = product.category || 'Без категории';
                categorySpan.className = `card__category ${categoryClass}`;
            }
            if (titleH2) titleH2.textContent = product.title;
            if (img)
                img.src = product.image.startsWith('http')
                    ? product.image
                    : `${this.cdnUrl}/${product.image}`;
            if (priceSpan)
                priceSpan.textContent =
                    product.price !== null ? `${product.price} синапсов` : 'Бесценно';

            card.addEventListener('click', () => {
                this.emitter.emit('product:open', { id: product.id });
            });

            this.gallery.appendChild(card);
        });
    }
}