import api from './backend';

export const TMDB_IMG = 'https://image.tmdb.org/t/p';
export const poster = (path, size = 'w342') => path ? `${TMDB_IMG}/${size}${path}` : '/no-poster.png';
export const backdrop = (path) => path ? `${TMDB_IMG}/original${path}` : null;

export const dramas = {
  trending: () => api.get('/dramas/trending'),
  newReleases: (page = 1) => api.get('/dramas/new-releases?page=' + page),
  popular: (page = 1) => api.get('/dramas/popular?page=' + page),
  romance: () => api.get('/dramas/romance'),
  action: () => api.get('/dramas/action'),
  search: (q, page = 1) => api.get('/dramas/search?q=' + encodeURIComponent(q) + '&page=' + page),
  detail: (id) => api.get('/dramas/' + id),
  videos: (id) => api.get('/dramas/' + id + '/videos'),
  season: (id, s) => api.get('/dramas/' + id + '/season/' + s),
};


