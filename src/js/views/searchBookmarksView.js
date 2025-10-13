import { getPosterLink } from '../helpers.js';
import View from './View.js';

class SearchBookmarksView extends View {
  _parentEl = document.querySelector('.app-container');

  render(data, view) {
    this.clear();
    this._data = data;
    this._view = view;
    const h2Container = this._generateH2Container();
    const markup = this._generateMarkup(h2Container);
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup(h2) {
    const currentView = String(this._view);
    const markup = this._data
      .map(
        movie => `
      <li class="movies__card">
        <button
          class="movies__card-btn open-modal"
          aria-label="Display ${movie.title} details"
          data-movie-id="${movie.id}"
          data-media-type="${movie.mediaType}"
        >
          <img
            src="${getPosterLink('w500', movie.posterPath)}"
            alt="${movie.title} poster"
          />
        </button>
      </li>
      `
      )
      .join('');

    return `
      <section
        class="${currentView} results__container container flex"
        aria-label="${currentView}"
      >

        <!-- Button back -->
        <div class="button__back-container">
          <button
            class="button__back btn flex center"
            aria-label="Go back to home"
          >
            <ion-icon
              name="chevron-back-outline"
              class="icon icon--back"
            ></ion-icon>
            <p>Home</p>
          </button>
        </div>

        <!-- h2 -->
        ${h2}

        <!-- Movie posters container -->
        <ul class="results__posters-container">

          <!-- Posters -->
          ${markup}

        </ul>
      </section>
    `;
  }

  _generateH2Container() {
    const currentView = String(this._view);
    const capitalizeH2 =
      currentView.charAt(0).toUpperCase() + currentView.slice(1);

    return currentView === 'bookmarks'
      ? `<div class="h2--container flex"><h2>${capitalizeH2}</h2><button class="btn btn--clear-all" aria-label="Clear all bookmarks">Clear all <ion-icon name="trash-outline" class="icon icon--trash"></ion-icon></button></div>`
      : `<h2>${capitalizeH2}</h2>`;
  }

  addHandlerBtnHome(handler) {
    this._parentEl.addEventListener('click', function (e) {
      if (e.target.closest('.button__back')) handler();
    });
  }

  addHandlerClearAll(handler) {
    this._parentEl.addEventListener('click', function (e) {
      if (e.target.closest('.btn--clear-all')) handler();
    });
  }
}

export default new SearchBookmarksView();
