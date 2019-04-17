import { parse, stringify } from "query-string";

const getQueryParams = () => {
  const { search } = window.location;
  const q = parse(search);
  let movieId = null, query = null, params = {};
  if ("movie" in q)
    if (!Number.isInteger(movieId = Number(q.movie)))
      movieId = null;
  if ("query" in q) query = q.query;
  return { movieId, query };
}

// do not support url encoding for old browsers.
const setQueryParams = (params) => {
  if (window.history && window.history.replaceState){
    const { search } = window.location;
    const currentParams = parse(search);
    const nextParams = Object.assign(currentParams, params);
    const nextString = stringify(nextParams)
    window.history.replaceState(null, "", "?" + nextString)
  }
}

const getPosterURL = (file, size=300) => file && `https://image.tmdb.org/t/p/w${size}${file}`;

const getInfoURL = (home, imdb) => home || (imdb ? `https://www.imdb.com/title/${imdb}` : null);

const toDate = unix => new Date(unix).toLocaleDateString();

const debounce = (fn, time) => {
  let timeout, recentArgs;
  return (...args) => {
    recentArgs = args;
    timeout = timeout || setTimeout(() => {
      fn(...recentArgs);
      timeout = recentArgs = null;
    }, time);
  }
}

export { getQueryParams, setQueryParams, getPosterURL, getInfoURL, toDate, debounce };
