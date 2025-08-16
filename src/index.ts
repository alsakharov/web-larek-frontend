// --- Импорт зависимостей и компонентов ---
import './scss/styles.scss';
import { Api } from './components/base/api';
import { Catalog } from './models/catalog';
import { Product } from './types';
import { ModalView } from './components/ModalView';
import { ModalManager } from './components/base/ModalManager';
import { Cart } from './models/cart';
import { ErrorView } from './components/ErrorView';
import { API_URL, CDN_URL } from './utils/constants';
import { FormModel } from './models/form';
import { ProductListView } from './components/ProductListView';
import { CartView } from './components/CartView';
import { OrderFormView } from './components/OrderFormView';

// --- Инициализация моделей и API ---
const api = new Api(CDN_URL, API_URL);
const catalog = new Catalog(api);
const modalManager = new ModalManager();
const formModel = new FormModel();
const cart = new Cart();

// --- Получение элементов DOM ---
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById(
	'card-catalog'
) as HTMLTemplateElement;
const basketModal = document.querySelector(
	'.modal[data-modal="basket"]'
) as HTMLElement;
const basketList = basketModal?.querySelector('.basket__list') as HTMLElement;
const basketPrice = basketModal?.querySelector('.basket__price') as HTMLElement;
const basketCounter = document.querySelector(
	'.header__basket-counter'
) as HTMLElement;
const openBasketBtn = document.getElementById('open-basket-btn');

// --- Инициализация модальных окон ---
const orderModal = new ModalView('.modal[data-modal="order"]');
const contactModal = new ModalView('.modal[data-modal="contact"]');
const successModal = new ModalView('.modal[data-modal="success"]');
const errorView = new ErrorView('.modal[data-modal="error"]');
const productModal = new ModalView('.modal[data-modal="product"]');

// --- Массив для хранения товаров ---
let products: Product[] = [];

// --- Установка data-modal для всех модалок ---
const modalNames = [
	'product',
	'basket',
	'order',
	'contact',
	'success',
	'error',
	'add-to-cart',
];
document.querySelectorAll('.modal').forEach((modal, i) => {
	if (!modal.hasAttribute('data-modal') && modalNames[i]) {
		modal.setAttribute('data-modal', modalNames[i]);
	}
});

// --- Циклическая зависимость: объявляем переменные через let ---
let cartView: CartView;
let orderFormView: OrderFormView;

// --- Инициализация компонента корзины ---
// Передаём функцию, которая закрывает корзину и открывает форму заказа
cartView = new CartView(
	cart,
	basketList,
	basketPrice,
	basketModal,
	basketCounter,
	modalManager,
	showBasketNotify,
	() => {
		closeModalWithScroll('basket');
		orderFormView.openOrderStep1();
	}
);

// --- Инициализация компонента формы заказа ---
orderFormView = new OrderFormView(
	formModel,
	cart,
	api,
	orderModal,
	contactModal,
	successModal,
	errorView,
	cartView
);

// --- Инициализация компонента каталога товаров ---
const productListView = new ProductListView(
	catalog,
  api,
  gallery,
  cardTemplate,
  openProductModal
);

// --- Главная функция инициализации приложения ---
async function init() {
	try {
		await productListView.render(); // рендер каталога
		products = await catalog.getProducts(); // загрузка товаров
		cartView.render(); // рендер корзины
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

	productModal.setContent(`
    <div class="modal__container">
      <button class="modal__close" aria-label="закрыть" type="button"></button>
      <div class="card card_full">
        <img class="card__image" src="${imageSrc}" alt="${product.title}" />
        <div class="card__column">
          <span class="card__category ${categoryClass}">${
		product.category || ''
	}</span>
          <h2 class="card__title">${product.title}</h2>
          <p class="card__text">${product.description || ''}</p>
          <div class="card__row">
            <button class="button card__button" id="add-to-cart">В корзину</button>
            <span class="card__price">${
							product.price !== null ? product.price + ' синапсов' : 'Бесценно'
						}</span>
          </div>
        </div>
      </div>
    </div>
  `);

	openModalWithScroll('product');

	// --- Обработка кнопки "В корзину" ---
	const addBtn = productModal
		.getElement()
		.querySelector('#add-to-cart') as HTMLButtonElement;
	const inCart = cart.getItems().some((item) => item.id === product.id);

	if (addBtn) {
		if (product.price === null) {
			addBtn.disabled = true;
			addBtn.textContent = 'Недоступно';
		} else if (inCart) {
			addBtn.disabled = false;
			addBtn.textContent = 'Удалить из корзины';
			addBtn.addEventListener('click', () => {
				cart.removeItem(product.id);
				cartView.updateCounter();
				cartView.render();
				closeModalWithScroll('product');
				showBasketNotify('Товар удалён из корзины');
			});
		} else {
			addBtn.disabled = false;
			addBtn.textContent = 'В корзину';
			addBtn.addEventListener('click', () => {
				addToCart(product);
				closeModalWithScroll('product');
				showBasketNotify('Товар добавлен в корзину');
			});
		}
	}
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
			}, 500);
		}, 1500);
	}
}

// --- Открытие/закрытие модальных окон с блокировкой скролла ---
function openModalWithScroll(name: string) {
	modalManager.open(name);
	document.body.classList.add('page_fixed');
}
function closeModalWithScroll(name: string) {
	modalManager.close(name);
	document.body.classList.remove('page_fixed');
}
function closeAllModalsWithScroll() {
	modalManager.closeAll();
	document.body.classList.remove('page_fixed');
}

// --- Глобальные обработчики закрытия модалок ---
function setupModalCloseHandlers() {
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		if (target.classList.contains('modal__close')) {
			closeAllModalsWithScroll();
		}
		if (target.id === 'modal-cart-ok') {
			closeAllModalsWithScroll();
		}
		if (
			target.classList.contains('modal') &&
			target.classList.contains('modal_active')
		) {
			closeAllModalsWithScroll();
		}
	});
}

// --- Добавление товара в корзину ---
function addToCart(product: Product) {
	if (cart.getItems().some((item) => item.id === product.id)) return;
	cart.addItem(product);
	cartView.updateCounter();
	cartView.render();
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
	errorView.show();
	document.body.classList.add('page_fixed');
}

// --- Запуск приложения ---
init();
setupModalCloseHandlers();
