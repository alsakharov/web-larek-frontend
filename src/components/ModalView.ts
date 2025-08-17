import { View } from './base/View';

export class ModalView extends View<HTMLDivElement> {
    constructor(selector: string) {
        super(selector);
        this.setupCloseHandlers();
    }

    open() {
        this.show();
        document.body.classList.add('page_fixed');
    }

    close() {
        this.hide();
        document.body.classList.remove('page_fixed');
    }

    setContent(content: string | HTMLElement) {
        const contentContainer = this.element.querySelector('.modal__content') as HTMLElement;
        if (typeof content === 'string') {
            contentContainer.innerHTML = content;
        } else {
            contentContainer.innerHTML = '';
            contentContainer.appendChild(content);
        }
    }

    getElement(): HTMLDivElement {
        return this.element;
    }

    public render() {
        // Для совместимости с типами, если требуется
        this.show();
    }

    private setupCloseHandlers() {
        this.element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (
                target.classList.contains('modal__close') ||
                (target.classList.contains('modal') && this.element.classList.contains('modal_active'))
            ) {
                this.close();
            }
        });
    }
}