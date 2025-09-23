import View from './View.js';

// import { entries } from 'core-js/core/array';

class NavView extends View {
  _parentEl = document.querySelector('header');
  _slider = document.querySelector('.slider');
  _navHeight = this._parentEl.getBoundingClientRect().height;
  _logo = document.querySelectorAll('.logo');

  toggleFixed(isFixed) {
    if (isFixed) {
      this._parentEl.classList.add('nav--fixed');
      document.body.style.paddingTop = `${this._navHeight}px`;
    } else {
      this._parentEl.classList.remove('nav--fixed');
      document.body.style.paddingTop = '0';
    }
  }

  observeSlider(handler) {
    const obs = new IntersectionObserver(entries => handler(entries[0]), {
      root: null,
      threshold: 0,
      rootMargin: `-${this._navHeight}px`,
    });

    obs.observe(this._slider);
  }

  addHandlerScrollToTop(handler) {
    this._logo.forEach(logo =>
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      })
    );
  }
}

export default new NavView();
