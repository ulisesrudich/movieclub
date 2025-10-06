import * as model from './model.js';
import navView from './views/navView.js';
import homeView from './views/homeView.js';
import sliderView from './views/sliderView.js';
import moviesView from './views/moviesView.js';
import searchBookmarksView from './views/searchBookmarksView.js';
import modalView from './views/modalView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// import { entries } from 'core-js/core/array';

// Home
const controlHome = function () {
  // If user is at home screen, only scroll to top
  if (model.state.currentView === 'home') {
    homeView.scrollToTop();
    return;
  }

  // If user is not at home screen, render home screen / Render home when page loads
  controlInitHome();
};

const controlInitHome = function () {
  model.setView('home');
  homeView.render(model.state.homeMovies);

  initSlider();
  initMovies();

  homeView.scrollToTop();

  // ************
  // ************
  console.log('Data: ', model.state.homeMovies);
};

// Navbar
const initNavbar = function () {
  navView.setSliderElement();
  navView.observeSlider(controlNavDisplay);
  navView.addHandlerLogoClick(controlHome);
  navView.addHandlerSearch(controlSearch);
  navView.addHandlerBookmarks(controlBookmarks);
};

const controlNavDisplay = function (entry) {
  !entry.isIntersecting
    ? navView.toggleFixed(true)
    : navView.toggleFixed(false);
};

// Slider
const initSlider = function () {
  sliderView._initParent();
  sliderView.render(model.state.homeMovies.slice(0, 3));
  sliderView.initElements();
  model.setMaxSlide(sliderView.getSlidesCount());
  sliderView.initialDotsRender(model.state.slider.maxSlide);
  sliderView.slidesMove(0);
  sliderView.addHandlerPrevious(controlPreviousSlide);
  sliderView.addHandlerNext(controlNextSlide);
  sliderView.addHandlerDots(controlGoToSlide);
};

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

// Movies
const initMovies = function () {
  moviesView._initParent();
  moviesView.render(model.state.homeMovies);
  moviesView.initRows();
};

// Search results
// CREAR MÉTODO CON EVENT LISTENER EN BOTÓN DE 'BACK' EN bookmarksView.js/searchResultsView.js, Y USAR EN init():
// Se puede poner event listener en un botón que no existe al cargar la página??
const controlSearch = function () {
  // Storing user's input on search bar
  const inputValue = navView.getInputValue();
  // Clearing input
  navView.clearInput();
  // Clearing previously stored results
  model.state.results = [];

  if (!inputValue) return; // Escribir acá throw new Error para manejar el error

  // Setting currentView to 'search results'
  model.setView('results');
  // Llamar a la API con función de model, pasando inputValue:
  // Ej: model.APIcall(inputValue);
  // Almacenar lo que devuelve la API en model.state.results

  // Render results
  searchBookmarksView.render(model.state.results, model.state.currentView);
  searchBookmarksView.scrollToTop();
};

// Bookmarks
const controlBookmarks = function () {
  if (model.state.currentView === 'bookmarks') {
    searchBookmarksView.scrollToTop();
  } else {
    model.setView('bookmarks');
    searchBookmarksView.render(model.state.bookmarks, model.state.currentView);
    searchBookmarksView.scrollToTop();
  }
};

// Modal
const controlOpenModal = async function (e, el) {
  // const clicked = e.currentTarget;

  // Storing id & media type
  const id = el.dataset.movieId; // Trae valor del atributo 'data-movie-id' del HTML
  const mediaType = el.dataset.mediaType;

  // Getting movie/show by id & media type
  const movieData = await model.getMovieOrShowById(id, mediaType);

  // Showing modal with data about the clicked movie/show
  modalView.openModal(movieData);
};

/////////////////////////////////////////////

const init = async function () {
  try {
    // Home
    await model.getHomeMoviesAndShows();
    controlInitHome(); // initSlider() + initMovies()
    // Navbar
    initNavbar();
    // Modal
    modalView.addHandlerOpen(controlOpenModal);
  } catch (err) {
    console.error('Error initializing app.', err);
    // homeView.renderError(...)
  }
};
init();
