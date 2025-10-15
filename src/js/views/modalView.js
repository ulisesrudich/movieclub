import View from './View.js';
import { getPosterLink } from '../helpers.js';

class ModalView {
  _modal = document.querySelector('.overlay');
  _closeButton = document.querySelector('.modal__close-icon');
  _bookmarksButton = document.querySelector('.bookmarks');
  _bookmarksIcon = document.querySelector('.bookmarks--icon');
  _trailerButton = document.querySelector(
    '.modal__movie-data__button--trailer'
  );

  constructor() {
    this.addHandlerClose();
  }

  openModal(movieData = {}) {
    // Fill modal with the data of the clicked title
    this._fillModalData(movieData);

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
    this._modal.classList.remove('hidden');
  }

  closeModal() {
    // Hide modal
    this._modal.classList.add('hidden');

    // Unblocking page scroll when modal hides
    document.body.classList.remove('modal-open');

    // Taking away padding-right from body
    document.body.style.paddingRight = '';
    // And from nav when it has 'position: fixed' (not part of the body)
    if (document.querySelector('.nav').classList.contains('nav--fixed')) {
      document.querySelector('.nav__content').style.paddingRight = '';
    }
  }

  _fillModalData(data) {
    // Img src
    document.querySelector('.modal-img').src = getPosterLink(
      'w780',
      data.posterPath
    );

    // Img alt
    document.querySelector('.modal-img').alt = `${data.title} poster`;

    // Genre 1
    document.querySelector('.modal__chip-1').textContent = `${data.genre1}`;

    // Genre 2
    if (data.genre2) {
      document.querySelector('.modal__chip-2').classList.remove('hidden');
      document.querySelector('.modal__chip-2').textContent = `${data.genre2}`;
    } else {
      document.querySelector('.modal__chip-2').classList.add('hidden');
    }

    // Chip 3
    document.querySelector('.modal__chip-3').textContent = `${data.rating}⭐`;

    // Title
    document.querySelector('.modal-title').textContent = `${data.title}`;

    // Duration, release year & cast (2 actors)
    if (data.mediaType === 'movie') {
      document.querySelector('.modal-movie-info').innerHTML = `${
        data.duration
      } &bull; ${data.releaseYear} &bull; ${data.actors.join(', ')}`;
    } else {
      document.querySelector('.modal-movie-info').innerHTML = `${
        data.seasons
      } season${data.seasons > 1 ? 's' : ''} &bull; ${
        data.releaseYear
      } &bull; ${data.actors.join(', ')}`;
    }

    // Overview
    document.querySelector('.modal-overview').textContent = `${data.overview}`;
  }

  // Modal
  addHandlerClose() {
    this._closeButton.addEventListener('click', () => this.closeModal());
    this._modal.addEventListener('click', e => {
      if (e.target === this._modal) this.closeModal();
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        !this._modal.classList.contains('hidden') &&
        document.querySelector('.error__overlay').classList.contains('hidden')
      )
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

  // Modal button "Add bookmark"
  addHandlerBtnBookmarks(handler) {
    this._bookmarksButton.addEventListener('click', handler);
  }

  updateBtnBookmarks(state) {
    // Color + text content + icon
    if (state === 'added') {
      this._bookmarksButton.innerHTML =
        'Bookmarked <ion-icon name="checkmark-outline" class="icon bookmarks--icon"></ion-icon>';
      this._bookmarksButton.classList.remove(
        'modal__movie-data__button--bookmarks'
      );
      this._bookmarksButton.classList.add(
        'modal__movie-data__button--bookmarked'
      );
    }
    if (state === 'removed') {
      this._bookmarksButton.innerHTML =
        'Add bookmark <ion-icon name="bookmark-outline" class="icon bookmarks--icon"></ion-icon>';
      this._bookmarksButton.classList.remove(
        'modal__movie-data__button--bookmarked'
      );
      this._bookmarksButton.classList.add(
        'modal__movie-data__button--bookmarks'
      );
    }
  }

  addHandlerWatchTrailer(handler) {
    this._trailerButton.addEventListener('click', handler);
  }
}

export default new ModalView();
