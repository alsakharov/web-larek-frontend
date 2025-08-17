import { ModalView } from './ModalView';
import { ErrorView } from './ErrorView';
import { BaseFormView } from './BaseFormView';
import { OrderPresenter } from './OrderPresenter';

export class ContactFormView extends BaseFormView {
    constructor(
        modal: ModalView,
        errorView: ErrorView,
        private presenter: OrderPresenter,
        private onSuccess: () => void
    ) {
        super(modal, errorView);
    }

    open(payment: string, address: string) {
        this.modal.setContent(`
          <form id="contact-form" class="order">
            <div class="order__field">
              <label>
                Email:
                <input type="email" id="contact-email" class="form__input" placeholder="Введите Email" name="email"/>
              </label>
            </div>
            <div class="order__field">
              <label>
                Телефон:
                <input type="tel" id="contact-phone" class="form__input" placeholder="+7 (9" name="phone"/>
              </label>
            </div>
            <div class="order__buttons">
              <button type="submit" id="pay-btn" class="button" disabled>Оплатить</button>
              <span id="order-step2-error" class="order__error-text"></span>
            </div>
          </form>
        `);
        this.modal.open();

        const emailInput = this.modal.getElement().querySelector('#contact-email') as HTMLInputElement;
        const phoneInput = this.modal.getElement().querySelector('#contact-phone') as HTMLInputElement;
        const payBtn = this.modal.getElement().querySelector('#pay-btn') as HTMLButtonElement;
        const errorSpan2 = this.modal.getElement().querySelector('#order-step2-error') as HTMLSpanElement;

        emailInput.value = this.presenter.getEmail() || '';
        phoneInput.value = this.presenter.getPhone() || '';

        const validateStep2 = () => {
            this.presenter.setEmail(emailInput.value);
            this.presenter.setPhone(phoneInput.value);
            const errors = this.presenter.getFormErrors();
            errorSpan2.textContent = errors.email || errors.phone || '';
            payBtn.disabled = !!errorSpan2.textContent;
        };

        validateStep2();

        emailInput.addEventListener('input', () => {
            this.presenter.setEmail(emailInput.value);
            validateStep2();
        });

        phoneInput.addEventListener('input', () => {
            this.presenter.setPhone(phoneInput.value);
            validateStep2();
        });

        this.modal.getElement().querySelector('#contact-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (payBtn.disabled) return;

            const orderPayload = {
                payment,
                address,
                email: this.presenter.getEmail(),
                phone: this.presenter.getPhone(),
                total: this.presenter.getCartTotal(),
                items: this.presenter.getCartItems().map((item) => item.id),
            };

            try {
                const response = await this.presenter.sendOrder(orderPayload);
                if (response.id) {
                    this.presenter.clearCart();
                    this.onSuccess();
                } else {
                    this.showError(response.error || 'Ошибка при оформлении заказа');
                }
            } catch (err) {
                this.showError('Ошибка при оформлении заказа');
            }
        });
    }
}