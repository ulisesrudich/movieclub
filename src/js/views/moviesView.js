import View from './View.js';

class MoviesView extends View {
  constructor() {
    super();
    this._initRows();
  }

  _initRows() {
    const rowWrapper = document.querySelectorAll('.movies__row-wrapper');

    rowWrapper.forEach(row => {
      const postersRow = row.querySelector('.movies__row');
      const posters = row.querySelectorAll('.movies__card');
      const prevArrow = row.querySelector('.button__container--previous');
      const nextArrow = row.querySelector('.button__container--next');

      // Visible width of posters container
      const containerWidth = postersRow.offsetWidth;

      // Scrolled distance
      let scrolledDistance = 0;

      // Function to move row
      function moveRow(distance) {
        postersRow.style.transform = `translateX(${-distance}px)`;
      }

      // Function to show/hide arrow buttons
      function updateButtons() {
        // Prev button
        scrolledDistance <= 0
          ? prevArrow.classList.add('hidden')
          : prevArrow.classList.remove('hidden');

        // Next button
        // Last poster's index
        const lastIndex = posters.length - 1;
        // Last poster's offsetRight
        const lastIndexOffsetRight =
          posters[lastIndex].offsetLeft +
          posters[lastIndex].offsetWidth -
          scrolledDistance;

        lastIndexOffsetRight <= containerWidth
          ? nextArrow.classList.add('hidden')
          : nextArrow.classList.remove('hidden');
      }

      // Function to move to the next poster
      function findNextPoster() {
        // Calc padding-left of postersRow
        const rowStyles = window.getComputedStyle(postersRow);
        const paddingLeftRow = parseInt(rowStyles.paddingLeft, 10);

        // Storing index of first fully visible poster in the row
        let firstVisibleIndex = 0;
        for (let i = 0; i < posters.length; i++) {
          if (
            posters[i].offsetLeft + posters[i].offsetWidth >
            scrolledDistance + paddingLeftRow
          ) {
            firstVisibleIndex = i;
            break;
          }
        }

        // Storing index of the next poster (second fully visible poster in the row)
        const nextIndex = firstVisibleIndex + 1;
        if (nextIndex >= posters.length) return;

        // Calc distance to move postersRow
        let distanceToMove = posters[nextIndex].offsetLeft - paddingLeftRow;

        // Last poster's index
        const lastIndex = posters.length - 1;
        // Last poster's offsetRight
        const lastIndexOffsetRight =
          posters[lastIndex].offsetLeft +
          posters[lastIndex].offsetWidth -
          scrolledDistance;
        // If last poster is fully visible then no more scrolling is allowed
        if (lastIndexOffsetRight <= containerWidth) return;

        // Storing total scrolled distance
        scrolledDistance = distanceToMove;

        // Moving the row
        moveRow(scrolledDistance);
        updateButtons();
      }

      // Function to move to the previous poster
      function findPrevPoster() {
        // Calc padding-left of postersRow
        const rowStyles = window.getComputedStyle(postersRow);
        const paddingLeftRow = parseInt(rowStyles.paddingLeft, 10);

        // Storing index of first fully visible poster in the row
        let firstVisibleIndex = 0;
        for (let i = 0; i < posters.length; i++) {
          if (
            posters[i].offsetLeft + posters[i].offsetWidth >
            scrolledDistance + paddingLeftRow
          ) {
            firstVisibleIndex = i;
            break;
          }
        }

        // Storing index of the prev poster
        const prevIndex = firstVisibleIndex - 1;
        // If prev poster index is less than 0 then no more scrolling is allowed
        if (prevIndex < 0) return;

        // Calc distance to move postersRow
        let distanceToMove = posters[prevIndex].offsetLeft - paddingLeftRow;

        // Storing total scrolled distance
        scrolledDistance = distanceToMove;

        // Moving the row
        moveRow(scrolledDistance);
        updateButtons();
      }

      prevArrow.addEventListener('click', findPrevPoster);
      nextArrow.addEventListener('click', findNextPoster);

      updateButtons();
    });
  }
}

export default new MoviesView();
