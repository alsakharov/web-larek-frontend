import { View } from './base/View';

export class ErrorView extends View<HTMLDivElement> {
	constructor(selector: string) {
		super(selector);
	}

	showError(message: string) {
		this.setContent(`
            <div class="error-message">
                <span>${message}</span>
                <button id="error-close" class="error-close">Закрыть</button>
            </div>
        `);
		this.show();

		const closeBtn = this.getElement().querySelector('#error-close');
		closeBtn?.addEventListener('click', () => this.hide());
	}

	public getElement(): HTMLDivElement {
		return this.element;
	}
}
