export class ModalManager {
	// Открыть модальное окно по имени
	open(name: string) {
		document.querySelectorAll('.modal').forEach((modal) => {
			modal.classList.remove('modal_active');
		});
		const modal = document.querySelector(`.modal[data-modal="${name}"]`);
		if (modal) modal.classList.add('modal_active');
	}

	// Закрыть модальное окно по имени
	close(name: string) {
		const modal = document.querySelector(`.modal[data-modal="${name}"]`);
		if (modal) modal.classList.remove('modal_active');
	}

	// Закрыть все модальные окна
	closeAll() {
		document.querySelectorAll('.modal').forEach((modal) => {
			modal.classList.remove('modal_active');
		});
	}
}
