import './scss/styles.scss';
import { Api } from './components/base/api';
import { Catalog } from './models/catalog';
import { Film } from './types';

const API_BASE_URL = 'https://virtserver.swaggerhub.com/FenixDeveloper/yp-afisha-api/1.0.0';

const api = new Api(API_BASE_URL);
const catalog = new Catalog(api);

const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const basketModal = document.querySelector('.modal[data-modal="basket"]') as HTMLElement;
const basketList = basketModal?.querySelector('.basket__list') as HTMLElement;
const basketPrice = basketModal?.querySelector('.basket__price') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const openBasketBtn = document.getElementById('open-basket-btn');

let films: Film[] = [];
const cart: Film[] = [];

// Загружаем фильмы и рендерим каталог
catalog.getFilms()
  .then(data => {
    films = data || [];
    renderFilms(films);
  })
  .catch(err => {
    console.error('Ошибка при загрузке фильмов:', err.message);
  });

function renderFilms(films: Film[]) {
  gallery.innerHTML = '';
  films.forEach(film => {
    const card = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const categorySpan = card.querySelector('.card__category');
    const titleH2 = card.querySelector('.card__title');
    const img = card.querySelector('.card__image') as HTMLImageElement;
    const priceSpan = card.querySelector('.card__price');

    if (categorySpan) categorySpan.textContent = film.tags[0] || 'Без категории';
    if (titleH2) titleH2.textContent = film.title;
    if (img) img.src = film.cover.startsWith('http') ? film.cover : API_BASE_URL + film.cover;
    if (priceSpan) priceSpan.textContent = `${film.rating} рейтинг`;

    card.addEventListener('click', () => openFilmModal(film.id));

    gallery.appendChild(card);
  });
}

function setupModalCloseHandlers() {
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.remove('modal_active');
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('modal_active');
      }
    });
  });

  const okButton = document.querySelector('#modal-cart-ok');
  if (okButton) {
    okButton.addEventListener('click', () => {
      const modal = okButton.closest('.modal');
      if (modal) modal.classList.remove('modal_active');
    });
  }
}

function openModal(name: string) {
  const modal = document.querySelector(`.modal[data-modal="${name}"]`);
  if (modal) modal.classList.add('modal_active');
}

function closeModal(name: string) {
  const modal = document.querySelector(`.modal[data-modal="${name}"]`);
  if (modal) modal.classList.remove('modal_active');
}

function openFilmModal(filmId: string) {
  const film = films.find(f => f.id === filmId);
  if (!film) return;

  const modal = document.querySelector(`.modal[data-modal="film-detail"]`);
  const modalContent = modal?.querySelector('.modal__content');
  if (!modal || !modalContent) return;

  const imageSrc = film.image.startsWith('http') ? film.image : API_BASE_URL + film.image;

  modalContent.innerHTML = `
    <div class="card card_full">
      <img class="card__image" src="${imageSrc}" alt="${film.title}" />
      <div class="card__column">
        <span class="card__category card__category_other">${film.tags.join(', ')}</span>
        <h2 class="card__title">${film.title}</h2>
        <p class="card__text">${film.description || film.about}</p>
        <div class="card__row">
          <button class="button card__button" id="add-to-cart">В корзину</button>
          <span class="card__price">${film.rating} рейтинг</span>
        </div>
      </div>
    </div>
  `;

  openModal('film-detail');

  const addToCartBtn = modalContent.querySelector('#add-to-cart');
  addToCartBtn?.addEventListener('click', () => {
    addToCart(film);
    closeModal('film-detail');
    openModal('add-to-cart');
  });
}

function addToCart(film: Film) {
  cart.push(film);
  updateCartCounter();
  renderCart();
}

function renderCart() {
  if (!basketList || !basketPrice) return;

  basketList.innerHTML = '';

  cart.forEach((film, index) => {
    const li = document.createElement('li');
    li.className = 'basket__item card card_compact';
    li.innerHTML = `
      <span class="basket__item-index">${index + 1}</span>
      <span class="card__title">${film.title}</span>
      <span class="card__price">${film.rating} синапсов</span>
      <button class="basket__item-delete card__button" aria-label="удалить"></button>
    `;

    const deleteBtn = li.querySelector('.basket__item-delete') as HTMLElement;
    deleteBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      renderCart();
      updateCartCounter();
    });

    basketList.appendChild(li);
  });

  const totalPrice = cart.reduce((sum, film) => sum + film.rating, 0);
  basketPrice.textContent = `${totalPrice} синапсов`;
}

function updateCartCounter() {
  if (!basketCounter) return;
  basketCounter.textContent = cart.length.toString();
}

if (openBasketBtn) {
  openBasketBtn.addEventListener('click', () => {
    renderCart();
    openModal('basket');
  });
}

setupModalCloseHandlers();
