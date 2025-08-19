// Тип товара
export interface Product {
    id: string;           // Уникальный идентификатор товара
    title: string;        // Название товара
    description: string;  // Описание товара
    image: string;        // Ссылка на изображение
    category?: string;    // Категория товара (опционально)
    price: number | null; // Цена товара (может быть null)
}

// Ответ сервера при получении списка товаров
export interface ProductListResponse {
    total: number;    // Общее количество товаров
    items: Product[]; // Массив товаров
}

// Ответ сервера на оформление заказа
export interface OrderResponse {
    id: string;        // Идентификатор заказа
    total: number;     // Итоговая сумма заказа
    error?: string;    // Сообщение об ошибке (опционально)
}

// Тип ошибок формы (ключ — поле, значение — текст ошибки)
export type FormErrors = {
    address?: string; // Ошибка в поле адреса
    payment?: string; // Ошибка в поле оплаты
    email?: string;   // Ошибка в поле email
    phone?: string;   // Ошибка в поле телефона
};