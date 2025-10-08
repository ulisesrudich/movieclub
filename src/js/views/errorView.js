import View from './View.js';

class ErrorView extends View {
  _errorModal = document.querySelector('.error__overlay');
  _errorTextBox = document.querySelector('.error__message');
  _closeButton = document.querySelector('.error__close-icon');

  constructor() {
    super();
    this.addHandlerClose();
  }

  _openErrorModal(errMessage) {
    // Fill modal with error message
    this._fillErrorMessage(errMessage);

    // Calc scroll bar width
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Blocking page scroll when the modal is open
    document.body.classList.add('modal-open');

    // Adding padding-right to body to compensate for scroll bar disappearing (because of 'overflow: hidden')
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    // And to nav when it has 'position: fixed' (not part of the body)
    if (document.querySelector('.nav').classList.contains('nav--fixed')) {
      document.querySelector(
        '.nav__content'
      ).style.paddingRight = `${scrollBarWidth}px`;
    }

    // Show modal
    this._errorModal.classList.remove('hidden');
  }

  _closeErrorModal() {
    // Hide modal
    this._errorModal.classList.add('hidden');

    // Unblocking page scroll when the modal hides
    document.body.classList.remove('modal-open');

    // Taking away padding-right from body
    document.body.style.paddingRight = '';
    // And from nav when it has 'position: fixed' (not part of the body)
    if (document.querySelector('.nav').classList.contains('nav--fixed')) {
      document.querySelector('.nav__content').style.paddingRight = '';
    }
  }

  _fillErrorMessage(errMessage) {
    this._errorTextBox.textContent = `${errMessage}`;
  }

  addHandlerClose() {
    this._closeButton.addEventListener('click', () => this._closeErrorModal());
    this._errorModal.addEventListener('click', e => {
      if (e.target === this._errorModal) this._closeErrorModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._errorModal.classList.contains('hidden'))
        this._closeErrorModal();
    });
  }
}

export default new ErrorView();
