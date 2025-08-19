// --- Стили ---
import './scss/styles.scss';

// --- События ---
import { emitter } from './components/base/events';

// --- Константы ---
import { API_URL, CDN_URL } from './utils/constants';

// --- API ---
import { Api } from './components/base/api';
import { LarekApi } from './components/base/LarekApi';

// --- Модели ---
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { FormModel } from './components/models/FormModel';

// --- Интерфейсы ---
import { IOrderFormPresenter } from './components/interfaces/IOrderFormPresenter';

// --- Презентеры ---
import { createOrderFormPresenter } from './components/presenters/OrderFormPresenter';
import { createContactFormPresenter } from './components/presenters/ContactFormPresenter';
import { ProductListPresenter } from './components/presenters/ProductListPresenter';
import { CartPresenter } from './components/presenters/CartPresenter';

// --- View-компоненты ---
import { ModalView } from './components/views/ModalView';
import { ProductListView } from './components/views/ProductListView';
import { CartView } from './components/views/CartView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactFormView } from './components/views/ContactFormView';
import { SuccessModalView } from './components/views/SuccessModalView';
import { ProductPreviewView } from './components/views/ProductPreviewView';

// --- Инициализация моделей и API ---
const api = new Api(CDN_URL, API_URL);
const larekApi = new LarekApi(api);
const catalog = new Catalog();
const formModel = new FormModel();
const cart = new Cart();

// --- DOM-элементы ---
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const openBasketBtn = document.querySelector('.header__basket') as HTMLElement;
const cartRoot = document.querySelector('.header__container') as HTMLElement;

// --- View-компоненты ---
const modalView = new ModalView('#modal-container', emitter);
const productPreviewView = new ProductPreviewView(previewTemplate, CDN_URL, emitter);
const productListView = new ProductListView(gallery, cardTemplate, CDN_URL, emitter);
const cartView = new CartView(cartRoot, () => orderFormView.open(), modalView, emitter);
const successModalView = new SuccessModalView(modalView, () => cartView.updateCounter(), emitter);

// --- Инициализация презентеров и View-компонентов ---
const contactFormPresenter = createContactFormPresenter(formModel, cart, larekApi);
const contactFormView = new ContactFormView(
    modalView,
    contactFormPresenter,
    (total: number) => {
        cart.clear();
        formModel.clear();
        successModalView.open(total);
    },
    emitter
);

const orderFormPresenter: IOrderFormPresenter = createOrderFormPresenter(
    formModel,
    (payment: string, address: string) => contactFormView.open(payment, address)
);

const orderFormView = new OrderFormView(modalView, orderFormPresenter, emitter);

const cartPresenter = new CartPresenter(cart);
cartView.setPresenter(cartPresenter);

const productListPresenter = new ProductListPresenter(catalog, productListView, larekApi);

// --- События приложения ---
emitter.on('product:open', (event: { id: string }) => {
    const product = catalog.getProduct(event.id);
    if (!product) return;
    // Получаем флаг inCart через презентер
    const inCart = cart.hasProduct(product.id);
    const cardElement = productPreviewView.render(product, inCart);
    modalView.setContent(cardElement);
    modalView.open();
});

emitter.on('cart:add', (event: { product: any }) => {
    cart.addItem(event.product);
    cartView.openBasketModal();
});

emitter.on('cart:remove', (event: { productId: string }) => {
    cart.removeItem(event.productId);
    cartView.openBasketModal();
});

const triggerBasketOpen = emitter.trigger('basket:open');
openBasketBtn?.addEventListener('click', triggerBasketOpen);

emitter.on('basket:open', () => {
    cartView.openBasketModal();
});

// --- Запуск приложения ---
async function init() {
    const products = await larekApi.getProducts();
    catalog.setProducts(products);
    productListPresenter.fetchAndRender();
    cartView.updateCounter();
}

init();