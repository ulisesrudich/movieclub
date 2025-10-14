export const getPosterLink = function (posterSize = 'original', path) {
  if (!path) return;
  return `https://image.tmdb.org/t/p/${posterSize}${path}`;
};
