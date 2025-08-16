# Web-Larek (WEB-ларёк)

Интернет-магазин товаров для веб-разработчиков. Проект реализован на TypeScript с собственной архитектурой по паттерну MVP.

---

## 🌐 Ссылки на проект

[Репозиторий](https://github.com/alsakharov/web-larek-frontend)

[GitHub Pages](https://alsakharov.github.io/web-larek-frontend/)

---

## 🚀 Используемый стек

- **TypeScript** — строгая типизация
- **SCSS** — стилизация с переменными и вложенностью
- **Webpack** — сборка и управление зависимостями
- **Babel** — транспиляция JS
- **PostCSS (Autoprefixer)** — автопрефиксы для CSS
- **ESLint + Prettier** — поддержка качества и стиля кода
- **EventEmitter** — коммуникация между компонентами
- **REST API** — взаимодействие с бекендом ([larek-api.nomoreparties.co](https://larek-api.nomoreparties.co))

---

## 🚦 Запуск проекта

1. Установите зависимости:
   ```
   npm install
   ```
2. Запустите dev-сервер:
   ```
   npm run start
   ```
3. Откройте [http://localhost:8080](http://localhost:8080) в браузере.

---

## 📦 Структура проекта

- `src/models/` — бизнес-логика и хранение данных (`Catalog`, `Cart`, `Order`, `FormModel`)
- `src/components/` — UI-компоненты и абстракции (`ModalView`, `ModalManager`, `ErrorView`, `CartView`, `OrderFormView`, `ProductListView`)
- `src/types/` — типы данных, приходящих из API (`Product`, `OrderData`, `OrderResponse`)
- `src/scss/`, `src/common.blocks/` — стили
- `src/index.ts` — точка входа, связывает компоненты и модели

---

## 📝 Типы данных

- **Product** — товар:  
  ```ts
  interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }
  ```
- **OrderData** — заказ:  
  ```ts
  interface OrderData {
    payment: string;
    address: string;
    email: string;
    phone: string;
  }
  ```
- **OrderResponse** — ответ сервера на заказ

Типы описаны в [`src/types.ts`](src/types.ts).

---

## 📚 Основные компоненты и модели

- **Catalog** — получает и хранит список товаров, работает с API  
  _Методы:_ `loadProducts()`, `getProductById(id)`
- **Cart** — управляет корзиной пользователя  
  _Методы:_ `addProduct(product)`, `removeProduct(id)`, `getTotal()`
- **FormModel** — хранит данные заказа и пользователя  
  _Методы:_ `setField(field, value)`, `validate()`
- **ModalView** — базовый класс для модальных окон  
  _Методы:_ `open()`, `close()`
- **ModalManager** — управляет открытием/закрытием модалок  
  _Методы:_ `show(modal)`, `hide()`
- **ErrorView** — отображение ошибок  
  _Методы:_ `render(message)`
- **CartView** — отображение и управление корзиной  
  _Методы:_ `render(cart)`, `onRemove(id)`
- **OrderFormView** — оформление заказа  
  _Методы:_ `render(formModel)`, `onSubmit(data)`
- **ProductListView** — отображение каталога товаров  
  _Методы:_ `render(products)`, `onSelect(id)`
- **Api** — взаимодействие с сервером  
  _Методы:_ `getProducts()`, `createOrder(data)`

---

## 🔗 Взаимодействие компонентов

- `index.ts` инициализирует и связывает модели и компоненты через конструкторы и методы.
- Модальные окна открываются через `ModalManager`.
- Данные о товарах и корзине хранятся в моделях, UI обновляется через методы компонентов.
- Взаимодействие между классами реализовано через передачу экземпляров в конструктор, без создания внутри классов.
- Для коммуникации между компонентами используется `EventEmitter` с типами событий:
  - `product:select`
  - `cart:add`
  - `cart:remove`
  - `order:submit`
  - `modal:open`
  - `modal:close`

---

## 🏗️ Архитектурные паттерны

**MVP (Model-View-Presenter):**
- **Model** — бизнес-логика и данные (`Catalog`, `Cart`, `FormModel`)
- **View** — UI-компоненты (`ModalView`, `ErrorView`, `CartView`, `ProductListView`)
- **Presenter** — связывает модель и представление (`index.ts`)

---

## 📈 UML-схема классов

![UML-схема классов проекта Web-Larek. На схеме показаны основные компоненты, их методы, поля и связи между ними](src/images/uml_web_larek.svg)

---

## 📄 Документация и архитектура

- Все классы имеют одно назначение, не перегружены функционально.
- Повторяющийся код вынесен в утилиты.
- Все DOM-элементы, с которыми работают классы, сохраняются в поля класса.
- Запросы к API реализованы в моделях, не в компонентах отображения.
- Типы данных описаны в отдельном файле, не дублируются.
- Нет использования типа `any` без необходимости.
- Классы переиспользуемы, слабое связывание.
- Модальные окна закрываются по крестику и по клику вне окна.
- Кнопки перехода между шагами заказа становятся активными только после заполнения текущих данных.

---

## 💡 Дополнительно

- Проект легко расширять новыми компонентами и моделями.
- Код соответствует требованиям чек-листа и архитектурным паттернам.
- Все изменения отражаются в документации.

---