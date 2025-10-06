import { getPosterLink } from '../helpers.js';
import View from './View.js';

class SearchBookmarksView extends View {
  _parentEl = document.querySelector('.app-container');

  render(data, view) {
    this.clear();
    this._data = data;
    this._view = view;
    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    const currentView = String(this._view);
    console.log(this._data);
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
            aria-label="Go back to previous section"
          >
            <ion-icon
              name="chevron-back-outline"
              class="icon icon--back"
            ></ion-icon>
            <p>Back</p>
          </button>
        </div>

        <!-- h2 -->
        <h2>${currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
        <!-- Movie posters container -->
        <ul class="results__posters-container">

          <!-- Posters -->
          ${markup}

        </ul>
      </section>
    `;
  }
}

export default new SearchBookmarksView();
