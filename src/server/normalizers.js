// we don't care about most of the data, so we project the fields we want

const getBasicDetails = result => ({
  poster: result.poster_path,
  date: new Date(result.release_date).getTime(),
  votes: result.vote_count,
  score: result.vote_average,
  title: result.title,
  id: result.id
})

// normalize fields of detail view with our convention, including extra detail data
const getAllDetails = result => ({
  ...getBasicDetails(result),
  tagline: result.tagline,
  status: result.status,
  duration: result.runtime,
  budget: result.budget,
  revenue: result.revenue,
  overview: result.overview,
  language: result.original_language,
  imdb: result.imdb_id,
  homepage: result.homepage,
  genres: result.genres,
})

// we must normalize search data and popular data
const normalizeListView = results => ({
  total: results.total_results,
  pages: results.total_pages,
  page: results.page,
  list: results.results.map(getBasicDetails)
})

module.exports = { normalizeListView, getAllDetails };
