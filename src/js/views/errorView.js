import View from './View.js';

class ErrorView extends View {
  _errorModal = document.querySelector('.error__overlay');
  _errorTextBox = document.querySelector('.error__message');

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

    // Show modal
    this._errorModal.classList.remove('hidden');
  }

  _fillErrorMessage(errMessage) {
    this._errorTextBox.textContent = `${errMessage}`;
  }
}

export default new ErrorView();
