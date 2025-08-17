import { ModalView } from './ModalView';
import { ErrorView } from './ErrorView';

export class BaseFormView {
    constructor(
        protected modal: ModalView,
        protected errorView: ErrorView
    ) {}

    showError(message: string) {
        this.errorView.showError(message);
    }
}