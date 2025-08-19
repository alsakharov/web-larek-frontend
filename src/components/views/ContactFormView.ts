import { ModalView } from './ModalView';
import { BaseFormView } from './BaseFormView';
import { IContactFormPresenter } from '../interfaces/IContactFormPresenter';
import { EventEmitter } from '../base/events';

export class ContactFormView extends BaseFormView {
    constructor(
        modal: ModalView,
        private presenter: IContactFormPresenter,
        private onSuccess: (total: number) => void,
        private emitter: EventEmitter
    ) {
        super(modal);
    }

    open(payment: string, address: string) {
        const template = document.getElementById('contacts') as HTMLTemplateElement;
        const fragment = template.content.cloneNode(true);
        const container = document.createElement('div');
        container.appendChild(fragment);
        this.modal.setContent(container);
        this.modal.open();

        const modalElement = this.modal.getElement();
        const emailInput = modalElement.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = modalElement.querySelector('input[name="phone"]') as HTMLInputElement;
        const payBtn = modalElement.querySelector('.modal__actions .button[type="submit"]') as HTMLButtonElement;

        emailInput.value = this.presenter.getEmail() || '';
        phoneInput.value = this.presenter.getPhone() || '';

        const updatePayBtnState = () => {
            payBtn.disabled = !this.presenter.validateContactFields();
        };

        updatePayBtnState();

        emailInput.addEventListener('input', () => {
            this.presenter.setEmail(emailInput.value);
            this.presenter.validateContactFields();
            const errorBlock = modalElement.querySelector('.form__errors') as HTMLElement;
            if (errorBlock) {
                errorBlock.textContent = Object.values(this.presenter.getFormErrors()).join(', ');
            }
            updatePayBtnState();
            this.emitter.emit('contacts:email:change', { email: emailInput.value });
        });

        phoneInput.addEventListener('input', () => {
            this.presenter.setPhone(phoneInput.value);
            this.presenter.validateContactFields();
            const errorBlock = modalElement.querySelector('.form__errors') as HTMLElement;
            if (errorBlock) {
                errorBlock.textContent = Object.values(this.presenter.getFormErrors()).join(', ');
            }
            updatePayBtnState();
            this.emitter.emit('contacts:phone:change', { phone: phoneInput.value });
        });

        modalElement.querySelector('form[name="contacts"]')?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const errorBlock = modalElement.querySelector('.form__errors') as HTMLElement;
            if (!this.presenter.validateContactFields()) {
                if (errorBlock) {
                    errorBlock.textContent = Object.values(this.presenter.getFormErrors()).join(', ');
                }
                return;
            } else if (errorBlock) {
                errorBlock.textContent = '';
            }

            try {
                const result = await this.presenter.submitOrder(payment, address);
                if (result.success) {
                    this.onSuccess(result.total ?? 0);
                    this.emitter.emit('contacts:submit', { payment, address, total: result.total ?? 0 });
                } else {
                    if (errorBlock) {
                        errorBlock.textContent = result.error || 'Ошибка при оформлении заказа';
                    }
                }
            } catch (err) {
                if (errorBlock) {
                    errorBlock.textContent = 'Ошибка при оформлении заказа';
                }
            }
        });
    }
}