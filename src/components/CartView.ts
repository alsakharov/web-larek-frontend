import { Cart } from '../models/cart';
import { Product } from '../types';
import { ModalManager } from './base/ModalManager';

export class CartView {
	constructor(
		private cart: Cart,
		private basketList: HTMLElement,
		private basketPrice: HTMLElement,
		private basketModal: HTMLElement,
		private basketCounter: HTMLElement,
		private modalManager: ModalManager,
		private showBasketNotify: (message: string) => void,
		private openOrderStep1: () => void
	) {}

	render() {
		if (!this.basketList || !this.basketPrice) return;
		this.basketList.innerHTML = '';
		this.cart.getItems().forEach((product: Product, index) => {
			const li = document.createElement('li');
			li.className = 'basket__item card card_compact';
			li.innerHTML = `
        <span class="basket__item-index">${index + 1}</span>
        <span class="card__title">${product.title}</span>
        <span class="card__price">${product.price} синапсов</span>
        <button class="basket__item-delete card__button" aria-label="удалить"></button>
      `;
			const deleteBtn = li.querySelector('.basket__item-delete') as HTMLElement;
			deleteBtn.addEventListener('click', () => {
				this.cart.removeItem(product.id);
				this.render();
				this.updateCounter();
				this.showBasketNotify('Товар удалён из корзины');
			});
			this.basketList.appendChild(li);
		});
		this.basketPrice.textContent = `${this.cart.getTotal()} синапсов`;

		const orderBtn = this.basketModal.querySelector(
			'#open-order-btn'
		) as HTMLButtonElement;
		if (orderBtn) {
			orderBtn.disabled = this.cart.getCount() === 0;
			orderBtn.onclick = () => {
				if (this.cart.getCount() === 0) return;
				this.openOrderStep1();
			};
		}
		this.updateCounter();
	}

	updateCounter() {
		if (!this.basketCounter) return;
		this.basketCounter.textContent = this.cart.getCount().toString();
	}

	openBasketModal() {
		this.render();
		this.modalManager.open('basket');
		document.body.classList.add('page_fixed');
	}
}
