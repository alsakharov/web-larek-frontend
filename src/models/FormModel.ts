import { FormErrors } from '../types';

export class FormModel {
	payment = '';
	email = '';
	phone = '';
	address = '';
	formErrors: FormErrors = {};

	setOrderAddress(value: string) {
		this.address = value;
		this.validateOrder();
	}

	setPayment(value: string) {
		this.payment = value;
		this.validateOrder();
	}

	validateOrder() {
    const errors: FormErrors = {};

    if (!this.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.payment) {
        errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;
    return Object.keys(errors).length === 0;
	}

	setEmail(value: string) {
		this.email = value;
		this.validateContacts();
	}

	setPhone(value: string) {
		this.phone = value;
		this.validateContacts();
	}

	validateContacts() {
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const regexpPhone = /^[\d\-\+\(\) ]{7,20}$/;
		const errors: FormErrors = {};

		if (!this.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (this.phone.startsWith('8')) {
			this.phone = '+7' + this.phone.slice(1);
		}

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!regexpPhone.test(this.phone)) {
			errors.phone = 'Некорректный формат номера телефона';
		}

		this.formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	getOrderLot() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address
		};
	}
	clear() {
		this.email = '';
		this.phone = '';
		this.address = '';
		this.payment = '';
	}
}
