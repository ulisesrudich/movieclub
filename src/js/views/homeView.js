import View from './View.js';

class HomeView extends View {
  _parentEl = document.querySelector('.app-container');

  _generateMarkup() {
    // if (!this._data || this._data.length === 0) {
    //   console.log('No movies to display (homeView.js > line 10)');
    //   return;
    // }

    return `
    <div class="home">
      <section class="slider-container"></section>
      <section class="movies-container"></section>
    </div>
    `;
  }
}

export default new HomeView();
