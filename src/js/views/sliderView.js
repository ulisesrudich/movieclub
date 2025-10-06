import View from './View.js';
import { getPosterLink } from '../helpers.js';

class SliderView extends View {
  _parentEl;
  _imgF1 = new URL('../../img/slider/slider-f1.jpg', import.meta.url);
  _imgBreaking = new URL(
    '../../img/slider/slider-breaking-bad.jpg',
    import.meta.url
  );
  _imgCriminal = new URL(
    '../../img/slider/slider-criminal-minds.jpg',
    import.meta.url
  );

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
    return `
        <section
          class="slider-dots__wrapper container"
          aria-label="Featured movies slider"
        >
          <div class="slider">
            <div class="slider__wrapper flex">

              <!-- Slide 1 -->
              <div class="slider__slide">
                <button
                  class="slider__slide-btn open-modal"
                  aria-label="Display F1 details"
                  data-movie-id="911430"
                  data-media-type="movie"
                >
                  <img
                    src="${this._imgF1}"
                    alt="F1 poster"
                  />
                </button>
              </div>

              <!-- Slide 2 -->
              <div class="slider__slide">
                <button
                  class="slider__slide-btn open-modal"
                  aria-label="Display Breaking Bad details"
                  data-movie-id="1396"
                  data-media-type="tv"
                >
                  <img
                    src="${this._imgBreaking}"
                    alt="Breaking Bad poster"
                  />
                </button>
              </div>

              <!-- Slide 3 -->
              <div class="slider__slide">
                <button
                  class="slider__slide-btn open-modal"
                  aria-label="Display Criminal Minds details"
                  data-movie-id="4057"
                  data-media-type="tv"
                >
                  <img
                    src="${this._imgCriminal}"
                    alt="Criminal Minds poster"
                  />
                </button>
              </div>

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
