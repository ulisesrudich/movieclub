import View from './View.js';

class ModalView {
  _modal = document.querySelector('.overlay');
  _closeButton = document.querySelector('.modal__close-icon');

  constructor() {
    this.addHandlerClose();
  }

  openModal(movieData = {}) {
    // Calculo width de la scroll bar:
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    // Cosas para cuando implemente la API:
    // Modifico toda la data del modal dinámicamente, según la peli que le haga click:
    // this._modal.querySelector('.modal__movie-data--title h3').textContent = movieData.title;
    this._modal.classList.remove('hidden');
    // Bloqueo el scroll de la página cuando el modal está abierto
    document.body.classList.add('modal-open');

    // Agrego al body padding-right equivalente al ancho de la scroll bar (que desaparece por 'overflow: hidden') para que no haya saltos en el layout:
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }

  closeModal() {
    this._modal.classList.add('hidden');
    // Desbloqueo el scroll de la página cuando el modal se cierra
    document.body.classList.remove('modal-open');
    // Saco padding-right que agregué con openModal():
    document.body.style.paddingRight = '';
  }

  addHandlerClose() {
    this._closeButton.addEventListener('click', () => this.closeModal());
    this._modal.addEventListener('click', e => {
      if (e.target === this._modal) this.closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._modal.classList.contains('hidden'))
        this.closeModal();
    });
  }

  addHandlerOpen(handler) {
    document.addEventListener('click', e => {
      const el = e.target.closest('.open-modal');
      if (!el) return;
      handler(e, el);
    });
  }
}

export default new ModalView();
