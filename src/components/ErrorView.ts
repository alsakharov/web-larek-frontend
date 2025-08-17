import { View } from './base/View';

export class ErrorView extends View<HTMLDivElement> {
    constructor(selector: string) {
        super(selector);
        this.setupCloseHandler();
    }

    showError(message: string) {
        const content = document.createElement('div');
        content.className = 'error-message';
        content.innerHTML = `
            <span>${message}</span>
            <button id="error-close" class="error-close">Закрыть</button>
        `;
        this.setContent(content);
        this.show();
        document.body.classList.add('page_fixed');
    }

    getElement(): HTMLDivElement {
        return this.element;
    }

    public render() {
        this.show();
    }

    private setupCloseHandler() {
        this.element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.id === 'error-close' || target.classList.contains('modal__close')) {
                this.hide();
                document.body.classList.remove('page_fixed');
            }
        });
    }
}