const { isPageNumber, isInteger, send, sendErr } = require("./helpers");
const { normalizeListView, getAllDetails } = require("./normalizers");

// handlers exist in their own file for a sake of unit testing

// requires movie id
const getMovieDetails = (cli, req, res, next) => {
  const { movieId } = req.body;
  if (!isInteger(movieId)) {
    const message = "needs valid `movieId`"
    send(res, 400, message);
    return next(new Error(message))
  }
  cli.movieInfo({id: movieId}, (err, data) => {
    if (err) return sendErr(res, next);
    send(res, 200, getAllDetails(data));
  })
};

const getPopularMovies = (cli, req, res, next) => {
  const { pageNumber: page = 1 } = req.body;
  // refactor opportunity at some point
  if (!isPageNumber(page)){
    const message = "needs valid `pageNumber`";
    send(res, 400, message);
    return next(new Error(message));
  }
  cli.miscPopularMovies({page}, (err, data) => {
    if (err) return sendErr(res, next);
    send(res, 200, normalizeListView(data))
  })
}

const searchMovies = (cli, req, res, next) => {
  const { searchTerm: query, pageNumber: page = 1 } = req.body;
  if (!query){
    const message = "needs valid `searchTerm`";
    send(res, 400, message)
    return next(new Error(message));
  }
  if (!isPageNumber(page)){
    const message = "needs valid `pageNumber`";
    send(res, 400, message);
    return next(new Error(message));
  }
  cli.searchMovie({page, query}, (err, data) => {
    if (err) return sendErr(res, next);
    send(res, 200, normalizeListView(data));
  })
};

module.exports = { getMovieDetails, getPopularMovies, searchMovies };
