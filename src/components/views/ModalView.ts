import { View } from '../base/View';
import { EventEmitter } from '../base/events';

export class ModalView extends View<HTMLDivElement> {
    private onCloseCallback?: () => void;
    private emitter: EventEmitter;
    private contentContainer: HTMLElement;

    constructor(selector: string, emitter: EventEmitter) {
        super(selector);
        this.emitter = emitter;
        this.contentContainer = this.element.querySelector('.modal__content') as HTMLElement;
        if (!this.contentContainer) {
            throw new Error('Modal content container not found');
        }
        this.setupCloseHandlers();
        this.emitter.on('modal:close', () => this.close());
    }

    open() {
        this.show();
        document.body.classList.add('page_fixed');
        this.emitter.emit('modal:open');
    }

    close() {
        this.hide();
        document.body.classList.remove('page_fixed');
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    setContent(content: string | HTMLElement) {
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(content);
        }
    }

    setOnClose(callback: () => void) {
        this.onCloseCallback = callback;
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