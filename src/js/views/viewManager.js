import View from './View.js';

class ViewManager extends View {
  _views = {
    home: document.querySelector('.home'),
    search: document.querySelector('.search'),
    bookmarks: document.querySelector('.bookmarks'),
  };

  goToView(view) {
    Object.keys(this._views).forEach(v => {
      this._views[v].classList.toggle('hidden', v !== view);
    });
  }
}

export default new ViewManager();
