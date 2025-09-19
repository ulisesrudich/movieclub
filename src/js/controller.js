import * as model from './model.js';
import navView from './views/navView.js';
import sliderView from './views/sliderView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// import { entries } from 'core-js/core/array';

// Navbar
const controlNavDisplay = function (entry) {
  !entry.isIntersecting
    ? navView.toggleFixed(true)
    : navView.toggleFixed(false);
};

// Slider
const controlPreviousSlide = function () {
  model.state.slider.currentSlide === 0
    ? (model.state.slider.currentSlide = model.state.slider.maxSlide)
    : model.state.slider.currentSlide--;

  sliderView.slidesMove(model.state.slider.currentSlide);
};

const controlNextSlide = function () {
  model.state.slider.currentSlide === model.state.slider.maxSlide
    ? (model.state.slider.currentSlide = 0)
    : model.state.slider.currentSlide++;

  sliderView.slidesMove(model.state.slider.currentSlide);
};

const controlGoToSlide = function (slide) {
  model.state.slider.currentSlide = slide;
  sliderView.slidesMove(slide);
};

const init = function () {
  // Navbar
  navView.observeSlider(controlNavDisplay);
  // Slider
  model.setMaxSlide(sliderView.getSlidesCount());
  sliderView.initialDotsRender(model.state.slider.maxSlide);
  sliderView.slidesMove(0);
  sliderView.addHandlerPrevious(controlPreviousSlide);
  sliderView.addHandlerNext(controlNextSlide);
  sliderView.addHandlerDots(controlGoToSlide);
};
init();
