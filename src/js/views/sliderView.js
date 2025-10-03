import View from './View.js';
import { getPosterLink } from '../helpers.js';

class SliderView extends View {
  _parentEl;

  initElements() {
    this._slider = this._parentEl.querySelector('.slider__wrapper');
    this._slides = this._parentEl.querySelectorAll('.slider__slide');
    this._buttonPrevious = this._parentEl.querySelector('.btn__slider-prev');
    this._buttonNext = this._parentEl.querySelector('.btn__slider-next');
    this._dotsContainer = this._parentEl.querySelector('.slider__dots');
  }

  _initParent() {
    this._parentEl = document.querySelector('.slider-container');
  }

  _generateMarkup() {
    const slidesMarkup = () => {
      if (!this._data || this._data.length === 0) return '';

      let markup = '';

      const slidesCount = Math.min(3, this._data.length);

      for (let i = 0; i < slidesCount; i++) {
        markup += `
        <div class="slider__slide open-modal">
          <button
            class="slider__slide-btn"
            aria-label="Display ${this._data[i].title} details"
            data-movie-id="${this._data[i].id}"
            data-media-type="${this._data[i].mediaType}"
          >
            <img
              src="${getPosterLink(undefined, this._data[i].bigPosterPath)}"
              alt="${this._data[i].title} poster"
            />
          </button>
        </div>
        `;
      }
      return markup;
    };

    return `
        <section
          class="slider-dots__wrapper container"
          aria-label="Featured movies slider"
        >
          <div class="slider">
            <div class="slider__wrapper flex">

              ${slidesMarkup()}

            </div>
            <!-- Button previous -->
            <button
              class="button__container button__container--previous btn__slider-prev"
              aria-label="Move to previous slide"
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
              class="button__container button__container--next btn__slider-next"
              aria-label="Move to next slide"
            >
              <div class="button__box flex center">
                <ion-icon
                  name="chevron-forward-outline"
                  class="button__icon"
                ></ion-icon>
              </div>
            </button>
            </div>
          </div>
          
          <!-- Slider dots -->
          <div class="slider__dots flex center"></div>
        </section>
    `;
  }

  getSlidesCount() {
    return this._slides.length - 1;
  }

  slidesMove(move) {
    this._slider.style.transform = `translateX(${-move * 100}%)`;
    this.updateActiveDot(move);
  }

  addHandlerPrevious(handler) {
    this._buttonPrevious.addEventListener('click', handler);
  }

  addHandlerNext(handler) {
    this._buttonNext.addEventListener('click', handler);
  }

  initialDotsRender(slidesCount) {
    this._dotsContainer.innerHTML = '';
    for (let i = 0; i <= slidesCount; i++) {
      this._dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="slider__dot ${
          i === 0 ? 'slider__dot--active' : ''
        }" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
      );
    }
  }

  updateActiveDot(slide) {
    const dots = this._dotsContainer.querySelectorAll('.slider__dot');
    dots.forEach(dot => dot.classList.remove('slider__dot--active'));
    this._dotsContainer
      .querySelector(`.slider__dot[data-slide="${slide}"]`)
      .classList.add('slider__dot--active');
  }

  addHandlerDots(handler) {
    this._dotsContainer.addEventListener('click', function (e) {
      const dot = e.target.closest('.slider__dot');
      if (!dot) return;
      const slide = +dot.dataset.slide;
      handler(slide);
    });
  }
}

export default new SliderView();
