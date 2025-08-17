import { ModalView } from './ModalView';
import { ErrorView } from './ErrorView';
import { BaseFormView } from './BaseFormView';
import { OrderPresenter } from './OrderPresenter';

export class OrderFormView extends BaseFormView {
    constructor(
        modal: ModalView,
        errorView: ErrorView,
        private presenter: OrderPresenter,
        private onNextStep: (payment: string, address: string) => void
    ) {
        super(modal, errorView);
    }

    open() {
        this.modal.setContent(`
          <form id="order-form" class="order">
            <div class="order__field">
              <div class="order__label">Способ оплаты</div>
              <div class="order__payment">
                <button type="button" class="order__payment-btn" data-type="card">Онлайн</button>
                <button type="button" class="order__payment-btn" data-type="cash">При получении</button>
              </div>
            </div>
            <div class="order__field">
              <div class="order__label">Адрес доставки</div>
              <input type="text" id="delivery-address" class="form__input" placeholder="Введите адрес" name="address" />
            </div>
            <div class="order__buttons">
              <button type="submit" id="next-step" class="button" disabled>Далее</button>
              <span id="order-step1-error" class="order__error-text"></span>
            </div>
          </form>
        `);
        this.modal.open();

        const paymentBtns = Array.from(
            this.modal.getElement().querySelectorAll('.order__payment-btn')
        ) as HTMLButtonElement[];
        const addressInput = this.modal.getElement().querySelector('#delivery-address') as HTMLInputElement;
        addressInput.value = this.presenter.getAddress() || '';
        const nextStepBtn = this.modal.getElement().querySelector('#next-step') as HTMLButtonElement;
        const errorSpan = this.modal.getElement().querySelector('#order-step1-error') as HTMLSpanElement;
        let selectedPayment = this.presenter.getPayment() || '';

        const validateStep1 = () => {
            this.presenter.setPayment(selectedPayment);
            this.presenter.setOrderAddress(addressInput.value.trim());
            const errors = this.presenter.getFormErrors();
            errorSpan.textContent = errors.payment || errors.address || '';
            nextStepBtn.disabled = !!errorSpan.textContent;
        };

        if (this.presenter.getPayment()) {
            paymentBtns.forEach((btn) => {
                if (btn.dataset.type === this.presenter.getPayment()) {
                    btn.classList.add('order__payment-btn_active');
                    selectedPayment = this.presenter.getPayment();
                }
            });
            validateStep1();
        }

        paymentBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                paymentBtns.forEach((b) =>
                    b.classList.remove('order__payment-btn_active')
                );
                btn.classList.add('order__payment-btn_active');
                selectedPayment = btn.dataset.type || '';
                this.presenter.setPayment(selectedPayment);
                validateStep1();
            });
        });

        addressInput.addEventListener('input', () => {
            this.presenter.setOrderAddress(addressInput.value.trim());
            validateStep1();
        });

        this.modal.getElement().querySelector('#order-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            if (nextStepBtn.disabled) return;
            this.modal.close();
            document.body.classList.remove('page_fixed');
            this.onNextStep(selectedPayment, addressInput.value.trim());
        });
    }
}