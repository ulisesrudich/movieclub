class SliderView {
  _slider = document.querySelector('.slider__wrapper');
  _slides = document.querySelectorAll('.slider__slide');
  _buttonPrevious = document.querySelector('.btn__slider-prev');
  _buttonNext = document.querySelector('.btn__slider-next');
  _dotsContainer = document.querySelector('.slider__dots');

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
