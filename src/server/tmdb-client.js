const createTMDBClient = require("moviedb");

const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) throw new Error(`
  No TMDB_API_KEY in environment
  (make sure you \`export TMDB_API_KEY=<your_key>\`)
`);

module.exports = createTMDBClient(apiKey);
