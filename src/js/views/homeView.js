import View from './View.js';

class HomeView extends View {
  _parentEl = document.querySelector('.app-container');

  _generateMarkup() {
    return `
    <div class="home">
      <section class="slider-container"></section>
      <section class="movies-container"></section>
    </div>
    `;
  }
}

export default new HomeView();
