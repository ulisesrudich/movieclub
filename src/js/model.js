export const state = {
  slider: {
    currentSlide: 0,
    maxSlide: 0,
  },
};

export const setMaxSlide = function (slidesCount) {
  state.slider.maxSlide = slidesCount;
};
