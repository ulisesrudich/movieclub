import { API_KEY, BASE_API_URL, BASE_YT_URL } from './config.js';

export const state = {
  currentView: 'home', // home, search results, bookmarks
  slider: {
    currentSlide: 0,
    maxSlide: 0,
  },
  homeMovies: [],
  bookmarks: [],
  results: [], // search results
  currentlyDisplayedInModal: '', // movie that's being currently displayed in the modal
};

// API
// For parsing property names of the data fetched by the API, that will be displayed in the modal
export const parseAPIPropertyNamesModal = function (obj, mediaType) {
  return {
    id: obj.id,
    mediaType: mediaType,
    title: obj.title || obj.name,
    posterPath: obj.poster_path,
    bigPosterPath: obj.backdrop_path, // Eliminar
    releaseYear: (obj.release_date || obj.first_air_date || '').slice(0, 4),
    overview: obj.overview || 'No overview available',
    // Parsear para que marque duración con formato => 2h 22m (ahora está en formato 88m):
    duration: obj.runtime
      ? `${Math.floor(obj.runtime / 60)}h ${obj.runtime % 60}m`
      : '1h 30m',
    seasons: obj.number_of_seasons || undefined,
    genre1: obj.genres?.[0]?.name,
    genre2: obj.genres?.[1]?.name,
    rating: Math.trunc(+obj.vote_average * 10) / 10 || 5,
    // Array with 2 actors names
    actors:
      obj.credits.cast.length > 0
        ? obj.credits.cast.slice(0, 2).map(actor => actor.name)
        : ['No credited actors'],
  };
};

// For parsing property names of the initial data fetched by the API
export const parseAPIPropertyNamesHome = function (obj, category) {
  return {
    id: obj.id,
    mediaType:
      obj.media_type || (category?.startsWith('movie') ? 'movie' : 'tv'),
    title: obj.title || obj.name,
    posterPath: obj.poster_path,
    bigPosterPath: obj.backdrop_path, // Eliminar
  };
};

// For fetching data of the corresponding movie/show clicked
export const getMovieOrShowById = async function (id, mediaType) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
    );
    const data = await res.json();

    if (data.success && data.success === false)
      throw new Error(
        `Could not fetch data for this title, please try another one :)`
      );

    // Updating currently displayed movie/show
    state.currentlyDisplayedInModal = '';
    state.currentlyDisplayedInModal = parseAPIPropertyNamesModal(
      data,
      mediaType
    );

    return parseAPIPropertyNamesModal(data, mediaType);
  } catch (err) {
    throw err;
  }
};

// For showing search results (search bar)
export const getMoviesAndShowsByQuery = async function (query) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/search/multi?api_key=${API_KEY}&query=${query}&language=en-US`
    );
    const data = await res.json();

    if (data.total_results === 0)
      throw new Error(
        'No results found for your search, please try another one :)'
      );

    // Filtering out actors. Filtering out movies that don't have a poster to display. Limiting to 12 results after the filtering
    const dataFiltered = data.results
      .filter(
        item =>
          (item.media_type === 'movie' || item.media_type === 'tv') &&
          item.poster_path &&
          item.poster_path !== ''
      )
      .slice(0, 12);

    // Parsing property names
    const dataParsed = dataFiltered.map(item =>
      parseAPIPropertyNamesHome(item, '')
    );

    // Storing results in model.state.results
    state.results = dataParsed;
  } catch (err) {
    throw err;
  }
};

// For fetching movies/series shown at the home screen (initial fetch)
export const getHomeMoviesAndShows = async function () {
  try {
    const [trending, popular, topRated] = await Promise.all([
      fetchCategory(
        'trending/all/day',
        16,
        '&without_genres=10762&without_original_language=ja'
      ),
      fetchCategory('movie/upcoming', 16, '&without_original_language=ja'),
      fetchCategory(
        'discover/tv',
        16,
        '&sort_by=popularity.desc&without_genres=16,10762&without_original_language=ja'
      ),
    ]);

    state.homeMovies = [...trending, ...popular, ...topRated];
  } catch (err) {
    throw err;
  }
};

// For fetching titles for each category (posters row) at the home screen
async function fetchCategory(category, quantity, extraParams = '') {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${category}?api_key=${API_KEY}&language=en-US${extraParams}`
    );
    const data = await res.json();

    if (data.success && data.success === false)
      throw new Error(
        'Could not load movies correctly, please refresh the page :)'
      );

    return (data.results ?? [])
      .map(item => parseAPIPropertyNamesHome(item, category))
      .slice(0, quantity);
  } catch (err) {
    throw err;
  }
}

// For getting the YouTube link to watch the movie's trailer
export const getMovieOrShowTrailer = async function () {
  try {
    // Getting all videos related to the movie/show
    const data = await fetch(
      `${BASE_API_URL}/${state.currentlyDisplayedInModal.mediaType}/${state.currentlyDisplayedInModal.id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const videos = await data.json();

    if (videos.results.length === 0)
      throw new Error(
        'No trailer available for this title, please try with another one :)'
      );

    // Filtering by type = trailer
    const trailer = videos.results.find(video => video.type === 'Trailer');

    if (!trailer)
      throw new Error(
        'No trailer available for this title, please try with another one :)'
      );

    // Returning YouTube URL
    return `${BASE_YT_URL}${trailer.key}`;
  } catch (err) {
    throw err;
  }
};

// For checking if a title is bookmarked
export const isBookmarked = function () {
  return state.bookmarks.some(
    item =>
      item.id === state.currentlyDisplayedInModal.id &&
      item.mediaType === state.currentlyDisplayedInModal.mediaType
  );
};

// For finding index of a bookmarked title
export const findIndexBookmarked = function () {
  return state.bookmarks.findIndex(
    item =>
      item.id === state.currentlyDisplayedInModal.id &&
      item.mediaType === state.currentlyDisplayedInModal.mediaType
  );
};

// View state
export const setView = function (view) {
  state.currentView = view;
};

// Slider
export const setMaxSlide = function (slidesCount) {
  state.slider.maxSlide = slidesCount;
};

// Bookmarks
export const pushToBookmarks = function (movie) {
  state.bookmarks.push(movie);
  persistBookmarks();
};

export const removeFromBookmarks = function () {
  state.bookmarks.splice(findIndexBookmarked(), 1);
  persistBookmarks();
};

export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
