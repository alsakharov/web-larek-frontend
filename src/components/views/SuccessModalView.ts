import { ModalView } from './ModalView';
import { EventEmitter } from '../base/events';

export class SuccessModalView {
    constructor(
        private modalView: ModalView,
        private onClose: () => void,
        private emitter: EventEmitter
    ) {}

    open(total: number) {
        const template = document.getElementById('success') as HTMLTemplateElement;
        const fragment = template.content.cloneNode(true);

        const modalContent = this.modalView.getElement().querySelector('.modal__content');
        if (modalContent) {
            modalContent.innerHTML = '';
            modalContent.appendChild(fragment);

            const totalElem = modalContent.querySelector('.order-success__description') as HTMLElement;
            if (totalElem) {
                totalElem.textContent = `Списано ${total} синапсов`;
            }
        }
        this.modalView.open();

        // Сбросить счётчик и сгенерировать событие при любом закрытии модалки
        this.modalView.setOnClose(() => {
            this.onClose();
            this.emitter.emit('modal:success:close', { total });
        });

        // Крестик только закрывает модалку и генерирует событие
        const closeBtn = this.modalView.getElement().querySelector('.order-success__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.modalView.close();
                this.emitter.emit('modal:success:close', { total });
            });
        }
    }
}