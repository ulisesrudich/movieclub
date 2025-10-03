import { API_KEY, BASE_API_URL } from './config.js';

export const state = {
  currentView: 'home', // home, search results, bookmarks
  slider: {
    currentSlide: 0,
    maxSlide: 0,
  },
  homeMovies: [],
  bookmarks: [],
  results: [],
};

// API
// For parsing property names of the data fetched by the API, that will be displayed in the modal
export const parseAPIPropertyNamesModal = function (obj) {
  return {
    id: obj.id,
    mediaType: obj.media_type,
    title: obj.title || obj.name,
    posterPath: obj.poster_path,
    bigPosterPath: obj.backdrop_path,
    releaseYear: (obj.release_date || obj.first_air_date || '').slice(0, 4),
    overview: obj.overview || 'No overview available',
    // Parsear para que marque duración con formato => 2h 22m (ahora está en formato 88m):
    duration: obj.runtime
      ? `${Math.floor(obj.runtime / 60)}h ${obj.runtime % 60}m`
      : undefined,
    genre1: obj.genres?.[0]?.name,
    genre2: obj.genres?.[1]?.name,
    seasons: obj.media_type === 'tv' ? obj.number_of_seasons : undefined,
    rating: Math.trunc(+obj.vote_average * 10) / 10,
    // Almacena un array con los nombres de 2 actores:
    actors: obj.credits?.cast?.slice(0, 2).map(actor => actor.name) || [
      'No credited actors',
    ],
  };
};

// For parsing property names of the initial data fetched by the API
export const parseAPIPropertyNamesHome = function (obj, category) {
  return {
    id: obj.id,
    mediaType: obj.media_type || category?.startsWith('movie') ? 'movie' : 'tv',
    title: obj.title || obj.name,
    posterPath: obj.poster_path,
    bigPosterPath: obj.backdrop_path,
  };
};

// For fetching data of the corresponding movie/show clicked
export const getMovieOrShowById = async function (id, mediaType) {
  const res = await fetch(
    `${BASE_API_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
  );

  if (!res.ok)
    throw new Error(
      `Could not fetch data for that title, please try another one :)`
    );

  const data = await res.json();
  return parseAPIPropertyNamesModal(data);
};

// For showing search results (search bar)
export const getMoviesAndShowsByQuery = async function (query) {
  const res = await fetch(
    `${BASE_API_URL}/search/multi?api_key=${API_KEY}&query=${query}&language=en-US`
  );
  const data = await res.json();
  // Filtering out actors and storing results in model.state.results
  state.results = data.results.filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  );
};

// For fetching movies/series shown at the home screen (initial fetch)
export const getHomeMoviesAndShows = async function () {
  try {
    const [trending, popular, topRated] = await Promise.all([
      fetchCategory(
        'trending/all/day',
        19,
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
    console.error('Error getHomeMoviesAndShows() in model.js', err);
    throw err;
  }
};

// For fetching titles for each category (posters row) at the home screen
async function fetchCategory(category, quantity, extraParams = '') {
  const res = await fetch(
    `${BASE_API_URL}/${category}?api_key=${API_KEY}&language=en-US${extraParams}`
  );

  if (!res.ok)
    throw new Error(
      'Could not load movies for this category, please refresh the page :)'
    );

  const data = await res.json();
  return (data.results ?? [])
    .map(item => parseAPIPropertyNamesHome(item, category))
    .slice(0, quantity);
}

// View state
export const setView = function (view) {
  state.currentView = view;
};

// Slider
export const setMaxSlide = function (slidesCount) {
  state.slider.maxSlide = slidesCount;
};
