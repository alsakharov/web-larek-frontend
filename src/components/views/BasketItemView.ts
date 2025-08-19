import { Product } from '../../types';

export class BasketItemView {
    static create(product: Product, index: number, onDelete: () => void): HTMLElement {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        // Все элементы ищутся только внутри карточки
        const indexSpan = li.querySelector('.basket__item-index') as HTMLElement;
        const titleSpan = li.querySelector('.card__title') as HTMLElement;
        const priceSpan = li.querySelector('.card__price') as HTMLElement;
        const deleteBtn = li.querySelector('.basket__item-delete') as HTMLElement;

        if (indexSpan) indexSpan.textContent = (index + 1).toString();
        if (titleSpan) titleSpan.textContent = product.title;
        if (priceSpan) priceSpan.textContent = `${product.price} синапсов`;
        if (deleteBtn) deleteBtn.addEventListener('click', onDelete);

        return li;
    }
}