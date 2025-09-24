import View from './View.js';

class MoviesView extends View {
  _postersRow = document.querySelector('.movies__row');
  _posters = document.querySelectorAll('.movies__card');
  _containerWidth = this._postersRow.offsetWidth;
  _nextArrow = document.querySelector('.psps'); // Cambiar nombre

  _distanceAlreadyMoved = 0;

  findNextPoster() {
    const firstPosterOffsetLeft = this._posters[0].offsetLeft;
    let lastPosterOffsetLeft = 0 + this._distanceAlreadyMoved;
    let nextPosterIndex = 0;

    for (let i = 0; i < this._posters.length; i++) {
      const poster = this._posters[i];
      const posterOffsetRight = poster.offsetLeft + poster.offsetWidth;

      if (posterOffsetRight > this._containerWidth) {
        lastPosterOffsetLeft = poster.offsetLeft;
        nextPosterIndex = i;
        break;
      }
    }

    let moveRowDistance = lastPosterOffsetLeft - firstPosterOffsetLeft;
    this._distanceAlreadyMoved += moveRowDistance;
    this.moveRow(this._distanceAlreadyMoved);
  }

  moveRow(distance) {
    this._postersRow.style.transform = `translateX(${-distance}px)`;
  }

  addHandlerNextArrow(handler) {
    this._nextArrow.addEventListener('click', handler);
  }
}

export default new MoviesView();
