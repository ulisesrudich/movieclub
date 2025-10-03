export const getPosterLink = function (posterSize = 'original', path) {
  if (!path) return;
  return `https://image.tmdb.org/t/p/${posterSize}${path}`;
};

export const parseDuration = function (min) {};

// Sigo usando scrollToTop() de View.js, cambiar por este:
export const scrollToTop = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
