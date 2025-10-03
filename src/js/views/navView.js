import View from './View.js';

// import { entries } from 'core-js/core/array';

class NavView extends View {
  _parentEl = document.querySelector('header');
  _slider = document.querySelector('.slider');
  _navHeight = this._parentEl.getBoundingClientRect().height;
  _logo = document.querySelectorAll('.logo');
  _searchBar = document.querySelector('.nav__search');
  _searchField = document.querySelector('.search__field');
  _btnBookmarks = document.querySelector('.btn--bookmarks');

  // Slider
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

    if (!this._slider) return;
    obs.observe(this._slider);
  }

  // Logo
  addHandlerLogoClick(handler) {
    this._logo.forEach(logo =>
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      })
    );
  }

  // Search bar
  addHandlerSearch(handler) {
    this._searchBar.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getInputValue() {
    return String(this._searchField.value);
  }

  clearInput() {
    this._searchField.value = '';
    this._searchField.blur();
  }

  // Bookmarks
  addHandlerBookmarks(handler) {
    this._btnBookmarks.addEventListener('click', handler);
  }
}

export default new NavView();
