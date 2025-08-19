import { Product } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductPreviewView {
    constructor(
        private template: HTMLTemplateElement,
        private cdnUrl: string,
        private emitter: EventEmitter
    ) {}

    render(product: Product, inCart: boolean): HTMLElement {
        const fragment = this.template.content.cloneNode(true) as DocumentFragment;
        const container = document.createElement('div');
        container.appendChild(fragment);

        const img = container.querySelector('.card__image') as HTMLImageElement;
        const categorySpan = container.querySelector('.card__category') as HTMLElement;
        const titleH2 = container.querySelector('.card__title') as HTMLElement;
        const textP = container.querySelector('.card__text') as HTMLElement;
        const priceSpan = container.querySelector('.card__price') as HTMLElement;
        const addBtn = container.querySelector('.card__button') as HTMLButtonElement;

        if (img) img.src = product.image.startsWith('http') ? product.image : `${this.cdnUrl}/${product.image}`;
        if (categorySpan) categorySpan.textContent = product.category || '';
        if (titleH2) titleH2.textContent = product.title;
        if (textP) textP.textContent = product.description || '';
        if (priceSpan) priceSpan.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        if (addBtn) {
            if (product.price === null) {
                addBtn.disabled = true;
                addBtn.textContent = 'Недоступно';
            } else if (inCart) {
                addBtn.disabled = false;
                addBtn.textContent = 'Удалить из корзины';
                addBtn.onclick = () => {
                    this.emitter.emit('cart:remove', { productId: product.id });
                    this.emitter.emit('modal:close');
                };
            } else {
                addBtn.disabled = false;
                addBtn.textContent = 'В корзину';
                addBtn.onclick = () => {
                    this.emitter.emit('cart:add', { product });
                    this.emitter.emit('modal:close');
                };
            }
        }

        return container;
    }
}