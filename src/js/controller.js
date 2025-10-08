import * as model from './model.js';
import navView from './views/navView.js';
import homeView from './views/homeView.js';
import sliderView from './views/sliderView.js';
import moviesView from './views/moviesView.js';
import searchBookmarksView from './views/searchBookmarksView.js';
import modalView from './views/modalView.js';
import errorView from './views/errorView.js';

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

  // Rendering error modal
  if (!model.state.homeMovies)
    errorView._openErrorModal(
      'Something went wrong when initializing the app, please refresh the page :)'
    );

  initSlider();
  initMovies();
  initNavbar();

  homeView.scrollToTop();
};

// Navbar
const initNavbar = function () {
  navView.setSliderElement();
  navView.observeSlider(controlNavDisplay);
  navView.addHandlerLogoClick(controlHome);
  navView.addHandlerSearch(controlSearch);
  navView.addHandlerBookmarks(controlRenderBookmarks);
};

const controlNavDisplay = function (entry) {
  if (
    model.state.currentView === 'results' ||
    model.state.currentView === 'bookmarks'
  ) {
    navView.toggleFixed(false);
    return;
  }

  if (model.state.currentView === 'home') {
    !entry.isIntersecting
      ? navView.toggleFixed(true)
      : navView.toggleFixed(false);
  }
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
// CREAR MÉTODO CON EVENT LISTENER EN BOTÓN DE 'BACK' EN searchBookmarksView.js, Y USAR EN init(). Se puede poner event listener en un botón que no existe al cargar la página??
const controlSearch = async function () {
  try {
    // Storing user's input on search bar
    const inputValue = navView.getInputValue();

    // Clearing input
    navView.clearInput();

    // Clearing previously stored results
    model.state.results = [];

    if (!inputValue) return;

    // *****************

    // Calling API with the search bar user's input (this stores API response in model.state.results)
    await model.getMoviesAndShowsByQuery(inputValue);

    // Handling error if API doesn't have a response for the query
    if (model.state.results.length === 0)
      throw new Error(
        'No results found for your search, please try another one :)'
      );

    // Setting currentView to 'search results'
    model.setView('results');
    // Setting navbar postion correctly
    controlNavDisplay();

    // Render results
    searchBookmarksView.render(model.state.results, model.state.currentView);
    searchBookmarksView.scrollToTop();
  } catch (err) {
    // Rendering error modal
    errorView._openErrorModal(err.message);
  }
};

// Bookmarks
const controlRenderBookmarks = function () {
  if (model.state.currentView === 'bookmarks') {
    searchBookmarksView.scrollToTop();
  } else {
    if (model.state.bookmarks.length === 0) {
      errorView._openErrorModal('No bookmarks yet :)');
      return;
    }

    // Setting currentView to 'bookmarks'
    model.setView('bookmarks');
    // Setting navbar postion correctly
    controlNavDisplay();

    searchBookmarksView.render(model.state.bookmarks, model.state.currentView);
    searchBookmarksView.scrollToTop();
  }
};

const controlAddRemoveBookmarks = function () {
  if (model.isBookmarked()) {
    model.removeFromBookmarks();
    modalView.updateBtnBookmarks('removed');
  } else {
    model.pushToBookmarks(model.state.currentlyDisplayedInModal);
    modalView.updateBtnBookmarks('added');
  }

  if (model.state.currentView === 'bookmarks') {
    searchBookmarksView.render(model.state.bookmarks, model.state.currentView);
  }
};

const controlLoadBookmarks = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) model.state.bookmarks = JSON.parse(bookmarks);
};

// Modal
const controlOpenModal = async function (e, el) {
  try {
    // const clicked = e.currentTarget;

    // Storing id & media type
    const id = el.dataset.movieId;
    const mediaType = el.dataset.mediaType;

    // Getting movie/show by id & media type
    const movieData = await model.getMovieOrShowById(id, mediaType);

    // Handling error
    if (!movieData)
      throw new Error(
        'Could not load information about this title, please try another one :)'
      );

    // Checking what state the bookmarks button should be in
    if (model.isBookmarked()) modalView.updateBtnBookmarks('added');
    if (!model.isBookmarked()) modalView.updateBtnBookmarks('removed');

    // Showing modal with data about the clicked movie/show
    modalView.openModal(movieData);
  } catch (err) {
    // Rendering error modal
    errorView._openErrorModal(err.message);
  }
};

/////////////////////////////////////////////

const init = async function () {
  try {
    // localStorage
    controlLoadBookmarks();
    // Home
    await model.getHomeMoviesAndShows();
    controlInitHome(); // initSlider() + initMovies()
    // Navbar
    initNavbar();
    // Modal
    modalView.addHandlerOpen(controlOpenModal);
    modalView.addHandlerBtnBookmarks(controlAddRemoveBookmarks);
  } catch (err) {
    // Rendering error modal
    errorView._openErrorModal(
      'An error occurred while initializing the app, please refresh the page :)'
    );
  }
};
init();
