import { ModalView } from './ModalView';

export class SuccessModalView {
    constructor(
        private modalView: ModalView,
        private onClose: () => void
    ) {}

    open() {
        this.modalView.setContent(`
          <div class="modal__container">
            <div class="order-success">
              <div class="order-success__icon"></div>
              <h2 class="order-success__title">Заказ оформлен</h2>
              <p class="order-success__text">Спасибо за покупку!</p>
              <button id="success-ok" class="order-success__btn button">Вернуться на главную</button>
            </div>
          </div>
        `);
        this.modalView.open();

        this.modalView.getElement().querySelector('#success-ok')?.addEventListener('click', () => {
            this.modalView.close();
            document.body.classList.remove('page_fixed');
            this.onClose();
        });
    }
}