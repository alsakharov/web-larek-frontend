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

    setContent(html: string) {
        this.element.innerHTML = html;
    }

    public getElement(): T {
        return this.element;
    }
}