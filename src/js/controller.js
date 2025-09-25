import * as model from './model.js';
import viewManager from './views/viewManager.js';
import navView from './views/navView.js';
import sliderView from './views/sliderView.js';
import moviesView from './views/moviesView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import viewManager from './views/viewManager.js';
// import { entries } from 'core-js/core/array';

// Home
// CREAR MÉTODO CON EVENT LISTENER EN BOTÓN DE 'BACK' EN bookmarksView.js/searchResultsView.js, Y USAR EN init():
// Se puede poner event listener en un botón que no existe al cargar la página??
const controlShowHome = function () {
  model.setView('home');
  viewManager.goToView('home');
};

// Navbar
const controlNavDisplay = function (entry) {
  !entry.isIntersecting
    ? navView.toggleFixed(true)
    : navView.toggleFixed(false);
};

const controlLogoClick = function () {
  if (model.state.currentView === 'home') {
    navView.scrollToTop();
  } else {
    model.setView('home');
    viewManager.goToView('home');
    navView.scrollToTop();
  }
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

// Movie rows

// Search results
// CREAR MÉTODO CON EVENT LISTENER EN BOTÓN DE 'SEARCH' EN navView.js, Y USAR EN init():
const controlShowSearchResults = function () {
  model.setView('search');
  viewManager.goToView('search');
};

// Bookmarks
// CREAR MÉTODO CON EVENT LISTENER EN BOTÓN DE 'BOOKMARKS' EN navView.js, Y USAR EN init():
const controlShowBookmarks = function () {
  model.setView('bookmarks');
  viewManager.goToView('bookmarks');
};

/////////////////////////////////////////////

const init = function () {
  // Navbar
  navView.observeSlider(controlNavDisplay);
  navView.addHandlerLogoClick(controlLogoClick);
  // Slider
  model.setMaxSlide(sliderView.getSlidesCount());
  sliderView.initialDotsRender(model.state.slider.maxSlide);
  sliderView.slidesMove(0);
  sliderView.addHandlerPrevious(controlPreviousSlide);
  sliderView.addHandlerNext(controlNextSlide);
  sliderView.addHandlerDots(controlGoToSlide);
  // Movie rows
  // moviesView.addHandlerPrevArrow();
  // moviesView.addHandlerNextArrow();
};
init();
