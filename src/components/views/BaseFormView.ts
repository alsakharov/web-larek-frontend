import { ModalView } from './ModalView';

export class BaseFormView {
    protected modal: ModalView;

    constructor(modal: ModalView) {
        this.modal = modal;
    }

    close() {
        this.modal.close();
    }

    getModal(): ModalView {
        return this.modal;
    }
}