import { BaseFormView } from './BaseFormView';
import { ModalView } from './ModalView';
import { IOrderFormPresenter } from '../interfaces/IOrderFormPresenter';
import { EventEmitter } from '../base/events';

export class OrderFormView extends BaseFormView {
    constructor(
        modal: ModalView,
        private presenter: IOrderFormPresenter,
        private emitter: EventEmitter
    ) {
        super(modal);
    }

    open() {
        const template = document.getElementById('order') as HTMLTemplateElement;
        const fragment = template.content.cloneNode(true);
        const container = document.createElement('div');
        container.appendChild(fragment);
        this.modal.setContent(container);
        this.modal.open();

        const modalElement = this.modal.getElement();
        const paymentBtns = Array.from(
            modalElement.querySelectorAll('.order__buttons .button')
        ) as HTMLButtonElement[];
        const addressInput = modalElement.querySelector('input[name="address"]') as HTMLInputElement;
        addressInput.value = this.presenter.getAddress() || '';
        const nextStepBtn = modalElement.querySelector('.modal__actions .button[type="submit"]') as HTMLButtonElement;
        let selectedPayment = this.presenter.getPayment() || '';

        const validateOrderFields = () => {
            this.presenter.setPayment(selectedPayment);
            this.presenter.setOrderAddress(addressInput.value.trim());
            nextStepBtn.disabled = !(selectedPayment && addressInput.value.trim());

            const errorBlock = modalElement.querySelector('.form__errors') as HTMLElement;
            this.presenter.validateOrder();
            if (errorBlock) {
                errorBlock.textContent = Object.values(this.presenter.getFormErrors()).join(', ');
            }
        };

        if (selectedPayment) {
            paymentBtns.forEach((btn) => {
                if (btn.getAttribute('name') === selectedPayment) {
                    btn.classList.add('button_alt-active');
                }
            });
            validateOrderFields();
        }

        paymentBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                paymentBtns.forEach((b) =>
                    b.classList.remove('button_alt-active')
                );
                btn.classList.add('button_alt-active');
                selectedPayment = btn.getAttribute('name') || '';
                this.presenter.setPayment(selectedPayment);
                validateOrderFields();
                this.emitter.emit('order:payment:change', { payment: selectedPayment });
            });
        });

        addressInput.addEventListener('input', () => {
            this.presenter.setOrderAddress(addressInput.value.trim());
            validateOrderFields();
            this.emitter.emit('order:address:change', { address: addressInput.value.trim() });
        });

        modalElement.querySelector('form[name="order"]')?.addEventListener('submit', (e) => {
            e.preventDefault();

            const errorBlock = modalElement.querySelector('.form__errors') as HTMLElement;
            if (!this.presenter.validateOrder()) {
                if (errorBlock) {
                    errorBlock.textContent = Object.values(this.presenter.getFormErrors()).join(', ');
                }
                return;
            } else if (errorBlock) {
                errorBlock.textContent = '';
            }

            if (nextStepBtn.disabled) return;
            this.modal.close();
            document.body.classList.remove('page_fixed');
            this.presenter.onNextStep(selectedPayment, addressInput.value.trim());

            this.emitter.emit('order:submit', {
                payment: selectedPayment,
                address: addressInput.value.trim()
            });
        });
    }
}