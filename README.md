# Web-Larek (WEB-ларёк)

Интернет-магазин товаров для веб-разработчиков. Проект реализован на TypeScript с архитектурой MVP.

---

## 🌐 Ссылки

- [Репозиторий](https://github.com/alsakharov/web-larek-frontend)
- [Демо на GitHub Pages](https://alsakharov.github.io/web-larek-frontend/)

---

## 🚀 Быстрый старт

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

```
src/
  ├── components/      # UI-компоненты, презентеры, модальные окна
  ├── models/          # Модели данных (каталог, корзина, формы)
  ├── types/           # Типы и интерфейсы
  ├── utils/           # Вспомогательные функции и константы
  ├── images/          # Картинки, UML-схемы
  ├── pages/           # HTML-файлы
  └── index.ts         # Точка входа
```

---

## 🏗️ Архитектура (MVP)

Проект разделён на три слоя:

1. **Модели** ([src/models](src/models)):
   - Хранят и управляют данными.
   - Не работают с DOM.
   - Примеры: [`Catalog`](src/models/catalog.ts), [`Cart`](src/models/cart.ts), [`FormModel`](src/models/FormModel.ts).

2. **Представления** ([src/components/views](src/components/views)):
   - Отвечают за отображение и работу с DOM.
   - Примеры: [`ProductListView`](src/components/views/ProductListView.ts), [`CartView`](src/components/views/CartView.ts), [`OrderFormView`](src/components/views/OrderFormView.ts), [`ModalView`](src/components/views/ModalView.ts).

3. **Презентеры** ([src/components/presenters](src/components/presenters)):
   - Связывают модели и представления, реализуют бизнес-логику.
   - Примеры: [`ProductListPresenter`](src/components/presenters/ProductListPresenter.ts), [`CartPresenter`](src/components/presenters/CartPresenter.ts), [`OrderFormPresenter`](src/components/presenters/OrderFormPresenter.ts).

Взаимодействие между слоями реализовано через события ([`EventEmitter`](src/components/base/events.ts)) и передачу экземпляров.

---

## 📝 Типы данных

Все типы и интерфейсы вынесены в [`src/types/index.ts`](src/types/index.ts):

```typescript
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: string;
}
```

Также описаны типы для ответов API, ошибок форм, моделей и представлений.

---

## 📚 Ключевые классы

- [`Catalog`](src/models/catalog.ts): хранит список товаров, уведомляет о изменениях.
- [`Cart`](src/models/cart.ts): управляет корзиной, добавляет/удаляет товары, считает сумму.
- [`FormModel`](src/models/FormModel.ts): хранит данные заказа и контактов, валидирует формы.
- [`ProductListView`](src/components/views/ProductListView.ts): отображает каталог товаров.
- [`CartView`](src/components/views/CartView.ts): отображает корзину и её содержимое.
- [`ModalView`](src/components/views/ModalView.ts): универсальное модальное окно.
- [`ProductListPresenter`](src/components/presenters/ProductListPresenter.ts): связывает каталог и его отображение.
- [`CartPresenter`](src/components/presenters/CartPresenter.ts): связывает корзину и её отображение.

---

## 🔗 Взаимодействие компонентов

- Все классы связываются через конструкторы и интерфейсы.
- Модальные окна открываются через [`ModalView`](src/components/views/ModalView.ts).
- Данные хранятся только в моделях.
- UI обновляется через методы представлений.
- Запросы к API реализованы в [`LarekApi`](src/components/base/LarekApi.ts) и [`Api`](src/components/base/api.ts).

---

## 📄 Принципы и правила

- Каждый класс отвечает только за свою часть (принцип единственной ответственности).
- Нет прямых связей между слоями — только через события и интерфейсы.
- Все DOM-элементы, с которыми работает класс, сохраняются в поля.
- Нет дублирования типов и логики.
- Не используются типы `any` без необходимости.
- Классы для объектов с сервера не создаются — только интерфейсы.

---

## 📈 UML-схема

![UML-схема](src/images/uml_web_larek.png)

---

## 💡 Пример сценария (MVP)

1. Пользователь кликает "В корзину" в [`ProductListView`](src/components/views/ProductListView.ts).
2. [`CartPresenter`](src/components/presenters/CartPresenter.ts) вызывает метод модели [`Cart.addItem`](src/models/cart.ts).
3. Модель корзины обновляет данные и генерирует событие.
4. Презентер вызывает рендер корзины у [`CartView`](src/components/views/CartView.ts).
5. Корзина отображает обновлённый список товаров и сумму.

---

## 🏁 Примечания

- Все классы и интерфейсы лежат в соответствующих папках.
- Документация и код полностью соответствуют архитектуре.
- Для расширения проекта достаточно добавить новые модели, представления или презентеры по аналогии.

---