export class View<T extends HTMLElement = HTMLElement> {
    protected element: T;

    constructor(selector: string) {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error(`Элемент ${selector} не найден`);
        }
        this.element = el as T;
    }

    show() {
        this.element.classList.add('modal_active');
    }

    hide() {
        this.element.classList.remove('modal_active');
    }

    setContent(content: string | HTMLElement) {
        if (typeof content === 'string') {
            this.element.innerHTML = content;
        } else {
            this.element.innerHTML = '';
            this.element.appendChild(content);
        }
    }

    public getElement(): T {
        return this.element;
    }
}