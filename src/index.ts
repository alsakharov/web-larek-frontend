import './scss/styles.scss';
import { Api } from './components/base/api';
import { LarekApi } from './components/base/LarekApi';
import { Catalog } from './models/catalog';
import { Product } from './types';
import { ModalView } from './components/ModalView';
import { Cart } from './models/cart';
import { ErrorView } from './components/ErrorView';
import { API_URL, CDN_URL } from './utils/constants';
import { FormModel } from './models/FormModel';
import { ProductListView } from './components/ProductListView';
import { CartView } from './components/CartView';
import { CartPresenter } from './components/CartPresenter';
import { OrderFormView } from './components/OrderFormView';
import { ContactFormView } from './components/ContactFormView';
import { OrderPresenter } from './components/OrderPresenter';
import { SuccessModalView } from './components/SuccessModalView';

// --- Инициализация моделей и API ---
const api = new Api(CDN_URL, API_URL);
const larekApi = new LarekApi(api);
const catalog = new Catalog();
const formModel = new FormModel();
const cart = new Cart();

// --- Получение элементов DOM ---
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const openBasketBtn = document.querySelector('.header__basket') as HTMLElement;
const errorView = new ErrorView('#modal-container');
const cartRoot = document.querySelector('.header__container') as HTMLElement;
const modalView = new ModalView('#modal-container');

// --- Динамически добавляем уведомление корзины, если его нет ---
function ensureBasketNotify() {
    const header = document.querySelector('.header__container');
    if (header && !document.querySelector('.basket-notify')) {
        const notify = document.createElement('div');
        notify.className = 'basket-notify basket-notify_hidden';
        header.appendChild(notify);
    }
}
ensureBasketNotify();

let products: Product[] = [];

// --- Презентеры ---
const orderPresenter = new OrderPresenter(formModel, cart, larekApi);
const cartPresenter = new CartPresenter(cart);

// --- Представления ---
let cartView: CartView;
let orderFormView: OrderFormView;
let contactFormView: ContactFormView;
let successModalView: SuccessModalView;

// --- Инициализация форм ---
orderFormView = new OrderFormView(
    modalView,
    errorView,
    orderPresenter,
    (payment, address) => contactFormView.open(payment, address)
);

contactFormView = new ContactFormView(
    modalView,
    errorView,
    orderPresenter,
    () => {
        // после успешного заказа, показать сообщение
        successModalView.open();
    }
);

cartView = new CartView(
    cartRoot,
    showBasketNotify,
    () => orderFormView.open()
);

cartPresenter.setView(cartView);

successModalView = new SuccessModalView(modalView, () => {
    orderPresenter.clearForm();
    cartView.updateCounter();
});

// --- Остальной код и инициализация приложения ---
const productListView = new ProductListView(
    larekApi,
    gallery,
    cardTemplate,
    openProductModal
);

// --- Главная функция инициализации приложения ---
async function init() {
    try {
        products = await larekApi.getProducts();
        catalog.setProducts(products);
        productListView.render(catalog.getProducts());
        cartView.updateCounter();
    } catch (err) {
        showError('Ошибка при загрузке товаров');
    }
}

// --- Открытие модального окна товара ---
function openProductModal(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const imageSrc = product.image.startsWith('http')
        ? product.image
        : `${api.cdnUrl}/${product.image}`;
    const categoryMap: Record<string, string> = {
        'софт-скил': 'soft',
        'хард-скил': 'hard',
        другое: 'other',
        дополнительное: 'additional',
        кнопка: 'button',
    };
    let categoryClass = 'card__category_other';
    if (product.category && categoryMap[product.category]) {
        categoryClass = `card__category_${categoryMap[product.category]}`;
    }

    // Используем шаблон для карточки товара
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;
    const img = content.querySelector('.card__image') as HTMLImageElement;
    const categorySpan = content.querySelector('.card__category') as HTMLElement;
    const titleH2 = content.querySelector('.card__title') as HTMLElement;
    const textP = content.querySelector('.card__text') as HTMLElement;
    const priceSpan = content.querySelector('.card__price') as HTMLElement;
    const addBtn = content.querySelector('.card__button') as HTMLButtonElement;

    if (img) img.src = imageSrc;
    if (categorySpan) {
        categorySpan.textContent = product.category || '';
        categorySpan.className = `card__category ${categoryClass}`;
    }
    if (titleH2) titleH2.textContent = product.title;
    if (textP) textP.textContent = product.description || '';
    if (priceSpan) priceSpan.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

    const inCart = cartPresenter.getItems().some((item) => item.id === product.id);

    if (addBtn) {
        if (product.price === null) {
            addBtn.disabled = true;
            addBtn.textContent = 'Недоступно';
        } else if (inCart) {
            addBtn.disabled = false;
            addBtn.textContent = 'Удалить из корзины';
            addBtn.onclick = () => {
                cartPresenter.handleRemoveItem(product.id);
                modalView.close();
                showBasketNotify('Товар удалён из корзины');
            };
        } else {
            addBtn.disabled = false;
            addBtn.textContent = 'В корзину';
            addBtn.onclick = () => {
                cartPresenter.addItem(product);
                modalView.close();
                showBasketNotify('Товар добавлен в корзину');
            };
        }
    }

    modalView.setContent(content);
    modalView.open();
}

// --- Показывает уведомление о корзине ---
function showBasketNotify(message: string) {
    const notify = document.querySelector('.basket-notify') as HTMLElement;
    if (notify) {
        notify.textContent = message;
        notify.classList.remove('basket-notify_hidden');
        notify.style.display = 'inline-block';
        setTimeout(() => {
            notify.classList.add('basket-notify_hidden');
            setTimeout(() => {
                notify.style.display = 'none';
            }, 800);
        }, 800);
    }
}

// --- Открытие корзины по кнопке ---
if (openBasketBtn) {
    openBasketBtn.addEventListener('click', () => {
        cartView.openBasketModal();
    });
}

// --- Показывает ошибку в модалке ---
function showError(message: string) {
    errorView.showError(message);
}

// --- Запуск приложения ---
init();