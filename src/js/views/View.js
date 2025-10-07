export default class View {
  _parentEl;

  clear() {
    this._parentEl.innerHTML = '';
  }

  render(data) {
    this.clear();
    this._data = data;
    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
