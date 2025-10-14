import View from './View.js';
import { getPosterLink } from '../helpers.js';

class MoviesView extends View {
  _parentEl;

  constructor() {
    super();
  }

  _generateMarkup() {
    const rowsMarkup = (fromMovie, untilMovie) => {
      if (!this._data || this._data.length === 0) return '';

      let markup = '';
      for (
        let i = fromMovie;
        i <= Math.min(untilMovie, this._data.length - 1);
        i++
      ) {
        markup += `
        <li class="movies__card">
          <button
            class="movies__card-btn open-modal"
            aria-label="Display ${this._data[i].title} details"
            data-movie-id="${this._data[i].id}"
            data-media-type="${this._data[i].mediaType}"
          >
            <img
              src="${getPosterLink('w500', this._data[i].posterPath)}"
              alt="${this._data[i].title} poster"
            />
          </button>
        </li>`;
      }

      return markup;
    };

    return `
        <!-- Row 1 -->
        <section class="movies flex" aria-label="Spotlight">
          <div class="container">
            <!-- Genre name -->
            <h2>Spotlight</h2>
          </div>
          <!-- Row container -->
          <div class="movies__row-wrapper">
            <!-- Movies row -->
            <ul class="movies__row">

            ${rowsMarkup(0, 15)}

            </ul>

            <!-- Button previous -->
            <button
              class="button__container button__container--previous hidden"
              aria-label="Move to previous row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-back-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
            <!-- Button next -->
            <button
              class="button__container button__container--next"
              aria-label="Move to next row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-forward-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
          </div>
        </section>

        <!-- Row 2 -->
        <section class="movies flex" aria-label="Comedy">
          <div class="container">
            <!-- Genre name -->
            <h2>Comedy</h2>
          </div>
          <!-- Row container -->
          <div class="movies__row-wrapper">
            <!-- Movies row -->
            <ul class="movies__row">

              ${rowsMarkup(16, 31)}

            </ul>

            <!-- Button previous -->
            <button
              class="button__container button__container--previous hidden"
              aria-label="Move to previous row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-back-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
            <!-- Button next -->
            <button
              class="button__container button__container--next"
              aria-label="Move to next row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-forward-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
          </div>
        </section>

        <!-- Row 3 -->
        <section class="movies flex" aria-label="Amazing series">
          <div class="container">
            <!-- Genre name -->
            <h2>Amazing series</h2>
          </div>
          <!-- Row container -->
          <div class="movies__row-wrapper">
            <!-- Movies row -->
            <ul class="movies__row">

              ${rowsMarkup(32, 47)}

            </ul>

            <!-- Button previous -->
            <button
              class="button__container button__container--previous hidden"
              aria-label="Move to previous row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-back-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
            <!-- Button next -->
            <button
              class="button__container button__container--next"
              aria-label="Move to next row of movies and shows"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-forward-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
          </div>
        </section>
    `;
  }

  initRows() {
    const rowWrapper = document.querySelectorAll('.movies__row-wrapper');

    rowWrapper.forEach(row => {
      const postersRow = row.querySelector('.movies__row');
      const posters = row.querySelectorAll('.movies__card');
      const prevArrow = row.querySelector('.button__container--previous');
      const nextArrow = row.querySelector('.button__container--next');

      // Visible width of posters container
      const containerWidth = postersRow.offsetWidth;

      // Scrolled distance
      let scrolledDistance = 0;

      // Function to move row
      function moveRow(distance) {
        postersRow.style.transform = `translateX(${-distance}px)`;
      }

      // Function to show/hide arrow buttons
      function updateButtons() {
        // Prev button
        scrolledDistance <= 0
          ? prevArrow.classList.add('hidden')
          : prevArrow.classList.remove('hidden');

        // Next button
        // Last poster's index
        const lastIndex = posters.length - 1;
        // Last poster's offsetRight
        const lastIndexOffsetRight =
          posters[lastIndex].offsetLeft +
          posters[lastIndex].offsetWidth -
          scrolledDistance;

        lastIndexOffsetRight <= containerWidth
          ? nextArrow.classList.add('hidden')
          : nextArrow.classList.remove('hidden');
      }

      // Function to move to the next poster
      function findNextPoster() {
        // Calc padding-left of postersRow
        const rowStyles = window.getComputedStyle(postersRow);
        const paddingLeftRow = parseInt(rowStyles.paddingLeft, 10);

        // Storing index of first fully visible poster in the row
        let firstVisibleIndex = 0;
        for (let i = 0; i < posters.length; i++) {
          if (
            posters[i].offsetLeft + posters[i].offsetWidth >
            scrolledDistance + paddingLeftRow
          ) {
            firstVisibleIndex = i;
            break;
          }
        }

        // Storing index of the next poster (second fully visible poster in the row)
        const nextIndex = firstVisibleIndex + 1;
        if (nextIndex >= posters.length) return;

        // Calc distance to move postersRow
        let distanceToMove = posters[nextIndex].offsetLeft - paddingLeftRow;

        // Last poster's index
        const lastIndex = posters.length - 1;
        // Last poster's offsetRight
        const lastIndexOffsetRight =
          posters[lastIndex].offsetLeft +
          posters[lastIndex].offsetWidth -
          scrolledDistance;
        // If last poster is fully visible then no more scrolling is allowed
        if (lastIndexOffsetRight <= containerWidth) return;

        // Storing total scrolled distance
        scrolledDistance = distanceToMove;

        // Moving the row
        moveRow(scrolledDistance);
        updateButtons();
      }

      // Function to move to the previous poster
      function findPrevPoster() {
        // Calc padding-left of postersRow
        const rowStyles = window.getComputedStyle(postersRow);
        const paddingLeftRow = parseInt(rowStyles.paddingLeft, 10);

        // Storing index of first fully visible poster in the row
        let firstVisibleIndex = 0;
        for (let i = 0; i < posters.length; i++) {
          if (
            posters[i].offsetLeft + posters[i].offsetWidth >
            scrolledDistance + paddingLeftRow
          ) {
            firstVisibleIndex = i;
            break;
          }
        }

        // Storing index of the prev poster
        const prevIndex = firstVisibleIndex - 1;
        // If prev poster index is less than 0 then no more scrolling is allowed
        if (prevIndex < 0) return;

        // Calc distance to move postersRow
        let distanceToMove = posters[prevIndex].offsetLeft - paddingLeftRow;

        // Storing total scrolled distance
        scrolledDistance = distanceToMove;

        // Moving the row
        moveRow(scrolledDistance);
        updateButtons();
      }

      prevArrow.addEventListener('click', findPrevPoster);
      nextArrow.addEventListener('click', findNextPoster);

      updateButtons();
    });
  }

  _initParent() {
    this._parentEl = document.querySelector('.movies-container');
  }
}

export default new MoviesView();
