import { View } from './base/View';

export class ModalView extends View<HTMLDivElement> {
	constructor(selector: string) {
		super(selector);
	}

	open() {
		this.show();
	}

	close() {
		this.hide();
	}

	setContent(html: string) {
		super.setContent(html);
	}
}
