// import { entries } from 'core-js/core/array';

class NavView {
  _parentEl = document.querySelector('header');
  _slider = document.querySelector('.slider');
  _navHeight = this._parentEl.getBoundingClientRect().height;

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
}

export default new NavView();

// Cuando intersecto con h2 de section movie rows agrego:
// .nav {
//   position: sticky;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: 1000;
// }

// .nav__bg {
//   background: rgba(10, 10, 10, 0.8);
//   backdrop-filter: blur(8px);
// }
