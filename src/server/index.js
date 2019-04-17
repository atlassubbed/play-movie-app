const app = require("express")();
const { json } = require("body-parser");
const { getMovieDetails, getPopularMovies, searchMovies } = require("./handlers");
const { isNaturalNumber, sendErr, makeRoute } = require("./helpers");
const tmdbClient = require("./tmdb-client");

// this is an independent API server, decoupled from the web server
// every method is GET as we do not support updating records

// searches must be reasonably short (should e2e test this)
app.use(json({limit: "200b"}));
app.use((err, req, res, next) => {
  if (err){
    // if we know the status code, use it, otherwise fallback to a 500
    const statusCode = isNaturalNumber(err.status) ? err.status : 500;
    return sendErr(res, null, statusCode);
  }
  next();
})

// considerations:
//   * namespace in case we extend this to return actors and other stuff
//   * favor POST + body over GET + query-params
//   * make the tmdbClient a parameter for simpler unit testing
app.post(makeRoute("movies"), getMovieDetails.bind(null, tmdbClient));
app.post(makeRoute("popular"), getPopularMovies.bind(null, tmdbClient));
app.post(makeRoute("search"), searchMovies.bind(null, tmdbClient));

app.listen(8000, () => console.log("tmdb-api server initialized"))
