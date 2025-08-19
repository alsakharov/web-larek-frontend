import { Product } from '../../types';
import { ModalView } from './ModalView';
import { BasketItemView } from './BasketItemView';
import { EventEmitter } from '../base/events';

export interface ICartPresenter {
    getItems: () => Product[];
    getTotal: () => number;
    getCount: () => number;
    handleRemoveItem: (id: string) => void;
}

export class CartView {
    private presenter!: ICartPresenter;
    private basketCounter: HTMLElement;
    private basketTemplate: HTMLTemplateElement;
    private emitter: EventEmitter;

    constructor(
        private root: HTMLElement,
        private openOrderStep1: () => void,
        private modalView: ModalView,
        emitter: EventEmitter
    ) {
        this.basketCounter = this.root.querySelector('.header__basket-counter') as HTMLElement;
        // Исправлено: ищем темплейт глобально
        this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        this.emitter = emitter;

        this.emitter.on('basket:open', () => this.openBasketModal());
        this.emitter.on('cart:changed', () => this.updateCounter());
    }

    setPresenter(presenter: ICartPresenter) {
        this.presenter = presenter;
    }

    renderBasketContent(): HTMLElement {
        const fragment = this.basketTemplate.content.cloneNode(true);
        const container = document.createElement('div');
        container.appendChild(fragment);

        const basketList = container.querySelector('.basket__list') as HTMLElement;
        const basketPrice = container.querySelector('.basket__price') as HTMLElement;
        const orderBtn = container.querySelector('.basket__button') as HTMLButtonElement;

        basketList.innerHTML = '';
        this.presenter.getItems().forEach((product: Product, index: number) => {
            const li = BasketItemView.create(product, index, () => {
                this.presenter.handleRemoveItem(product.id);
                this.openBasketModal();
                this.emitter.emit('basket:item:removed', { productId: product.id });
            });
            basketList.appendChild(li);
        });
        basketPrice.textContent = `${this.presenter.getTotal()} синапсов`;

        if (orderBtn) {
            orderBtn.disabled = this.presenter.getCount() === 0;
            orderBtn.onclick = () => {
                if (this.presenter.getCount() === 0) return;
                this.openOrderStep1();
            };
        }

        return container;
    }

    updateCounter() {
        if (this.basketCounter && this.presenter) {
            this.basketCounter.textContent = this.presenter.getCount().toString();
        }
    }

    openBasketModal() {
        const basketContent = this.renderBasketContent();
        this.modalView.setContent(basketContent);
        this.modalView.open();
        this.updateCounter();
    }

    update() {
        this.openBasketModal();
        this.updateCounter();
    }

    public render() {
        this.updateCounter();
    }
}