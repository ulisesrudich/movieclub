export const state = {
  currentView: 'home', // home, search results, bookmarks
  slider: {
    currentSlide: 0,
    maxSlide: 0,
  },
};

// View state
export const setView = function (view) {
  state.currentView = view;
};

// Slider
export const setMaxSlide = function (slidesCount) {
  state.slider.maxSlide = slidesCount;
};
