import { Product } from '../types';
import { ModalView } from './ModalView';
import { BasketItemView } from './BasketItemView';

export class CartView {
    private presenter!: {
        getItems: () => Product[];
        getTotal: () => number;
        getCount: () => number;
        handleRemoveItem: (id: string) => void;
    };

    private basketCounter: HTMLElement;
    private modalView: ModalView;
    private basketTemplate: HTMLTemplateElement;

    constructor(
        private root: HTMLElement,
        private showBasketNotify: (message: string) => void,
        private openOrderStep1: () => void
    ) {
        this.basketCounter = this.root.querySelector('.header__basket-counter') as HTMLElement;
        this.modalView = new ModalView('#modal-container');
        this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    }

    setPresenter(presenter: {
        getItems: () => Product[];
        getTotal: () => number;
        getCount: () => number;
        handleRemoveItem: (id: string) => void;
    }) {
        this.presenter = presenter;
    }

    renderBasketContent(): HTMLElement {
        const basketContent = this.basketTemplate.content.cloneNode(true) as HTMLElement;
        const basketList = basketContent.querySelector('.basket__list') as HTMLElement;
        const basketPrice = basketContent.querySelector('.basket__price') as HTMLElement;
        const orderBtn = basketContent.querySelector('.basket__button') as HTMLButtonElement;

        basketList.innerHTML = '';
        this.presenter.getItems().forEach((product: Product, index: number) => {
            const li = BasketItemView.create(product, index, () => {
                this.presenter.handleRemoveItem(product.id);
                this.showBasketNotify('Товар удалён из корзины');
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

        return basketContent;
    }

    updateCounter() {
        if (this.basketCounter) {
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