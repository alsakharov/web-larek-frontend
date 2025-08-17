import { Product } from '../types';

export class BasketItemView {
    static create(product: Product, index: number, onDelete: () => void): HTMLElement {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        li.querySelector('.basket__item-index')!.textContent = (index + 1).toString();
        li.querySelector('.card__title')!.textContent = product.title;
        li.querySelector('.card__price')!.textContent = `${product.price} синапсов`;

        const deleteBtn = li.querySelector('.basket__item-delete') as HTMLElement;
        deleteBtn.addEventListener('click', onDelete);

        return li;
    }
}