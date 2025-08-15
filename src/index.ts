// --- Импорт модулей и констант ---
import './scss/styles.scss';
import { Api } from './components/base/api';
import { Catalog } from './models/catalog';
import { Product, OrderResponse } from './types';
import { ModalView } from './components/ModalView';
import { ModalManager } from './components/base/ModalManager';
import { Cart } from './models/cart';
import { Order, OrderData } from './models/order';
import { ErrorView } from './components/ErrorView';
import { API_URL, CDN_URL } from './utils/constants';

// --- Инициализация API и моделей ---
const api = new Api(CDN_URL, API_URL);
const catalog = new Catalog(api);
const modalManager = new ModalManager(); // Управление окнами

// --- DOM-элементы ---
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const basketModal = document.querySelector('.modal[data-modal="basket"]') as HTMLElement;
const basketList = basketModal?.querySelector('.basket__list') as HTMLElement;
const basketPrice = basketModal?.querySelector('.basket__price') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const openBasketBtn = document.getElementById('open-basket-btn');

// --- Модальные окна ---
const orderModal = new ModalView('.modal[data-modal="order"]');
const contactModal = new ModalView('.modal[data-modal="contact"]');
const successModal = new ModalView('.modal[data-modal="success"]');
const errorView = new ErrorView('.modal[data-modal="error"]');
const productModal = new ModalView('.modal[data-modal="product"]');

// --- Модели корзины и заказа ---
let products: Product[] = [];
const cart = new Cart();
const order = new Order();

// --- Загрузка товаров и рендер каталога ---
async function init() {
  try {
    products = await catalog.getProducts();
    renderProducts(products);
  } catch (err) {
    showError('Ошибка при загрузке товаров');
  }
}

// --- Рендер карточек товаров ---
function renderProducts(products: Product[]) {
  gallery.innerHTML = '';
  products.forEach(product => {
    const card = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    // Заполнение карточки
    const categorySpan = card.querySelector('.card__category');
    const titleH2 = card.querySelector('.card__title');
    const img = card.querySelector('.card__image') as HTMLImageElement;
    const priceSpan = card.querySelector('.card__price');
    if (categorySpan) categorySpan.textContent = product.category || 'Без категории';
    if (titleH2) titleH2.textContent = product.title;
    if (img) img.src = product.image.startsWith('http') ? product.image : `${api.cdnUrl}/${product.image}`;
    if (priceSpan) priceSpan.textContent = `${product.price} ₽`;
    card.addEventListener('click', () => openProductModal(product.id));
    gallery.appendChild(card);
  });
}

// --- Открытие модального окна товара ---
function openProductModal(productId: string) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const imageSrc = product.image.startsWith('http') ? product.image : `${api.cdnUrl}/${product.image}`;
  productModal.setContent(`
    <div class="card card_full">
      <img class="card__image" src="${imageSrc}" alt="${product.title}" />
      <div class="card__column">
        <span class="card__category card__category_other">${product.category || ''}</span>
        <h2 class="card__title">${product.title}</h2>
        <p class="card__text">${product.description || ''}</p>
        <div class="card__row">
          <button class="button card__button" id="add-to-cart">В корзину</button>
          <span class="card__price">${product.price} ₽</span>
        </div>
      </div>
    </div>
  `);
  modalManager.open('product'); // Открываем окно продукта
  const addToCartBtn = productModal.getElement().querySelector('#add-to-cart');
  addToCartBtn?.addEventListener('click', () => {
    addToCart(product);
    modalManager.close('product');
    modalManager.open('add-to-cart');
  });
}

// --- Добавление товара в корзину ---
function addToCart(product: Product) {
  cart.addItem(product);
  updateCartCounter();
  renderCart();
}

// --- Рендер корзины ---
function renderCart() {
  if (!basketList || !basketPrice) return;
  basketList.innerHTML = '';
  cart.getItems().forEach((product, index) => {
    const li = document.createElement('li');
    li.className = 'basket__item card card_compact';
    li.innerHTML = `
      <span class="basket__item-index">${index + 1}</span>
      <span class="card__title">${product.title}</span>
      <span class="card__price">${product.price} ₽</span>
      <button class="basket__item-delete card__button" aria-label="удалить"></button>
    `;
    const deleteBtn = li.querySelector('.basket__item-delete') as HTMLElement;
    deleteBtn.addEventListener('click', () => {
      cart.removeItem(product.id);
      renderCart();
      updateCartCounter();
    });
    basketList.appendChild(li);
  });
  basketPrice.textContent = `${cart.getTotal()} ₽`;
}

// --- Обновление счетчика корзины ---
function updateCartCounter() {
  if (!basketCounter) return;
  basketCounter.textContent = cart.getCount().toString();
}

// --- Открытие корзины ---
if (openBasketBtn) {
  openBasketBtn.addEventListener('click', () => {
    renderCart();
    modalManager.open('basket'); // Открываем корзину
  });
}

// --- Обработчики закрытия модальных окон ---
function setupModalCloseHandlers() {
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
      modalManager.closeAll(); // Закрываем все окна
    });
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modalManager.closeAll();
      }
    });
  });
  const okButton = document.querySelector('#modal-cart-ok');
  if (okButton) {
    okButton.addEventListener('click', () => {
      modalManager.closeAll();
    });
  }
}

// --- Оформление заказа: шаг 1 ---
const orderButton = document.getElementById('order-btn');
if (orderButton) {
  orderButton.addEventListener('click', () => {
    if (cart.getCount() === 0) return;
    openOrderStep1();
  });
}
function openOrderStep1() {
  orderModal.setContent(`
    <form id="order-form">
      <h2>Оформление заказа</h2>
      <label>
        Способ оплаты:
        <select id="payment-type">
          <option value="">Выберите</option>
          <option value="card">Картой</option>
          <option value="cash">Наличными</option>
        </select>
      </label>
      <label>
        Адрес доставки:
        <input type="text" id="delivery-address" />
      </label>
      <button type="submit" id="next-step" disabled>Далее</button>
    </form>
  `);
  modalManager.open('order'); // Открываем окно заказа
  const paymentType = orderModal.getElement().querySelector('#payment-type') as HTMLSelectElement;
  const addressInput = orderModal.getElement().querySelector('#delivery-address') as HTMLInputElement;
  const nextStepBtn = orderModal.getElement().querySelector('#next-step') as HTMLButtonElement;
  function validateStep1() {
    nextStepBtn.disabled = !(paymentType.value && addressInput.value);
  }
  paymentType.addEventListener('change', validateStep1);
  addressInput.addEventListener('input', validateStep1);
  orderModal.getElement().querySelector('#order-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!paymentType.value || !addressInput.value) return;
    order.setPaymentType(paymentType.value);
    order.setAddress(addressInput.value);
    modalManager.close('order');
    openOrderStep2();
  });
}

// --- Оформление заказа: шаг 2 ---
function openOrderStep2() {
  contactModal.setContent(`
    <form id="contact-form">
      <h2>Контактные данные</h2>
      <label>
        Email:
        <input type="email" id="contact-email" />
      </label>
      <label>
        Телефон:
        <input type="tel" id="contact-phone" />
      </label>
      <button type="submit" id="pay-btn" disabled>Оплатить</button>
    </form>
  `);
  modalManager.open('contact'); // Открываем окно контактов
  const emailInput = contactModal.getElement().querySelector('#contact-email') as HTMLInputElement;
  const phoneInput = contactModal.getElement().querySelector('#contact-phone') as HTMLInputElement;
  const payBtn = contactModal.getElement().querySelector('#pay-btn') as HTMLButtonElement;
  function validateStep2() {
    payBtn.disabled = !(emailInput.value && phoneInput.value);
  }
  emailInput.addEventListener('input', validateStep2);
  phoneInput.addEventListener('input', validateStep2);
  contactModal.getElement().querySelector('#contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!emailInput.value || !phoneInput.value) return;
    order.setEmail(emailInput.value);
    order.setPhone(phoneInput.value);
    try {
      const response: OrderResponse = await api.sendOrder(order.getData() as OrderData, cart.getItems());
      if (response.success) {
        cart.clear();
        updateCartCounter();
        renderCart();
        modalManager.close('contact');
        openOrderSuccess();
      } else {
        showError(response.error || 'Ошибка при оформлении заказа');
      }
    } catch (err) {
      showError('Ошибка при оформлении заказа');
    }
  });
}

// --- Модальное окно успешного заказа ---
function openOrderSuccess() {
  successModal.setContent(`
    <div>
      <h2>Заказ успешно оформлен!</h2>
      <button id="success-ok">Ок</button>
    </div>
  `);
  modalManager.open('success'); // Открываем окно успеха
  successModal.getElement().querySelector('#success-ok')?.addEventListener('click', () => {
    modalManager.close('success');
    order.clear();
  });
}

// --- Компонент для ошибок ---
function showError(message: string) {
  errorView.showError(message);
  modalManager.open('error');
}

// --- Запуск приложения ---
init();
setupModalCloseHandlers();