import { FormModel } from '../models/form';
import { Cart } from '../models/cart';
import { ModalView } from './ModalView';
import { ErrorView } from './ErrorView';
import { Api } from './base/api';
import { OrderResponse } from '../types';

export class OrderFormView {
	constructor(
		private formModel: FormModel,
		private cart: Cart,
		private api: Api,
		private orderModal: ModalView,
		private contactModal: ModalView,
		private successModal: ModalView,
		private errorView: ErrorView,
		private cartView: { updateCounter: () => void; render: () => void }
	) {}

	openOrderStep1() {
		this.orderModal.setContent(`
      <div class="modal__container">
        <form id="order-form" class="order">
          <button class="modal__close" aria-label="закрыть" type="button"></button>
          <div class="order__field">
            <div class="order__label">Способ оплаты</div>
            <div class="order__payment">
              <button type="button" class="order__payment-btn" data-type="card">Онлайн</button>
              <button type="button" class="order__payment-btn" data-type="cash">При получении</button>
            </div>
          </div>
          <div class="order__field">
            <div class="order__label">Адрес доставки</div>
            <input type="text" id="delivery-address" class="form__input" placeholder="Введите адрес"  name="address" />
          </div>
          <div class="order__buttons">
            <button type="submit" id="next-step" class="button" disabled>Далее</button>
            <span id="order-step1-error" class="order__error-text"></span>
          </div>
        </form>
      </div>
    `);

		document.body.classList.add('page_fixed');
		this.orderModal.open();

		const paymentBtns = Array.from(
			this.orderModal.getElement().querySelectorAll('.order__payment-btn')
		) as HTMLButtonElement[];
		const addressInput = this.orderModal
			.getElement()
			.querySelector('#delivery-address') as HTMLInputElement;
		addressInput.value = this.formModel.address || '';
		const nextStepBtn = this.orderModal
			.getElement()
			.querySelector('#next-step') as HTMLButtonElement;
		const errorSpan = this.orderModal
			.getElement()
			.querySelector('#order-step1-error') as HTMLSpanElement;
		let selectedPayment = this.formModel.payment || '';

		const validateStep1 = () => {
			this.formModel.setPayment(selectedPayment);
			this.formModel.setOrderAddress(addressInput.value.trim());
			const errors = this.formModel.formErrors;
			errorSpan.textContent = errors.payment || errors.address || '';
			nextStepBtn.disabled = !!errorSpan.textContent;
		};

		if (this.formModel.payment) {
			paymentBtns.forEach((btn) => {
				if (btn.dataset.type === this.formModel.payment) {
					btn.classList.add('order__payment-btn_active');
					selectedPayment = this.formModel.payment;
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
				this.formModel.setPayment(selectedPayment);
				validateStep1();
			});
		});

		addressInput.addEventListener('input', () => {
			this.formModel.setOrderAddress(addressInput.value.trim());
			validateStep1();
		});

		this.orderModal
			.getElement()
			.querySelector('#order-form')
			?.addEventListener('submit', (e) => {
				e.preventDefault();
				if (nextStepBtn.disabled) return;
				this.orderModal.close();
				document.body.classList.remove('page_fixed');
				this.openOrderStep2(selectedPayment, addressInput.value.trim());
			});
	}

	openOrderStep2(selectedPayment: string, address: string) {
		this.contactModal.setContent(`
      <div class="modal__container">
        <form id="contact-form" class="order">
          <button class="modal__close" aria-label="закрыть" type="button"></button>
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
      </div>
    `);

		document.body.classList.add('page_fixed');
		this.contactModal.open();

		const emailInput = this.contactModal
			.getElement()
			.querySelector('#contact-email') as HTMLInputElement;
		const phoneInput = this.contactModal
			.getElement()
			.querySelector('#contact-phone') as HTMLInputElement;
		emailInput.value = this.formModel.email || '';
		phoneInput.value = this.formModel.phone || '';
		const payBtn = this.contactModal
			.getElement()
			.querySelector('#pay-btn') as HTMLButtonElement;
		const errorSpan2 = this.contactModal
			.getElement()
			.querySelector('#order-step2-error') as HTMLSpanElement;

		const validateStep2 = () => {
			this.formModel.setEmail(emailInput.value);
			this.formModel.setPhone(phoneInput.value);
			const errors = this.formModel.formErrors;
			errorSpan2.textContent = errors.email || errors.phone || '';
			payBtn.disabled = !!errorSpan2.textContent;
		};

		validateStep2();

		emailInput.addEventListener('input', () => {
			this.formModel.setEmail(emailInput.value);
			validateStep2();
		});

		phoneInput.addEventListener('input', () => {
			let value = phoneInput.value.replace(/\D/g, '');
			let formatted = '+';

			if (value.length > 0) formatted += value[0];
			if (value.length > 1) formatted += ' (' + value.slice(1, 4);
			if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
			if (value.length >= 7) formatted += '-' + value.slice(7, 9);
			if (value.length >= 9) formatted += '-' + value.slice(9, 11);

			phoneInput.value = formatted;
			this.formModel.setPhone(phoneInput.value);
			validateStep2();
		});

		this.contactModal
			.getElement()
			.querySelector('#contact-form')
			?.addEventListener('submit', async (e) => {
				e.preventDefault();
				if (payBtn.disabled) return;

				const orderData = {
					payment: selectedPayment,
					address: address,
					email: this.formModel.email,
					phone: this.formModel.phone,
					total: this.cart.getTotal(),
				};

				const items = this.cart.getItems().map((item) => ({
					productId: item.id,
					quantity: 1,
				}));

				try {
					const response: OrderResponse = await this.api.sendOrder(
						orderData,
						items
					);
					if (response.id) {
						this.cart.clear();
						this.cartView.updateCounter();
						this.cartView.render();
						this.contactModal.close();
						document.body.classList.remove('page_fixed');
						this.openOrderSuccess();
					} else {
						this.showError(response.error || 'Ошибка при оформлении заказа');
					}
				} catch (err) {
					this.showError('Ошибка при оформлении заказа');
				}
			});
	}

	openOrderSuccess() {
		this.successModal.setContent(`
      <div class="modal__container">
        <div class="order-success">
          <button class="modal__close" aria-label="закрыть" type="button"></button>
          <div class="order-success__icon"></div>
          <h2 class="order-success__title">Заказ оформлен</h2>
          <p class="order-success__text">Спасибо за покупку!</p>
          <button id="success-ok" class="order-success__btn button">Вернуться на главную</button>
        </div>
      </div>
    `);

		document.body.classList.add('page_fixed');
		this.successModal.open();

		this.successModal
			.getElement()
			.querySelector('#success-ok')
			?.addEventListener('click', () => {
				this.successModal.close();
				document.body.classList.remove('page_fixed');
				this.formModel.clear();
			});
	}

	showError(message: string) {
		this.errorView.showError(message);
		this.errorView.show();
		document.body.classList.add('page_fixed');
	}
}
