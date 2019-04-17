const { describe, it } = require("mocha")
const { expect } = require("chai");
const { getMovieDetails, searchMovies, getPopularMovies } = require("../../src/server/handlers");
const { makeMockRes } = require("./mocks");
const { listData, listDataNormalized, detailData, detailDataNormalized } = require("./fixtures");

const ensureRes = (res, code, data) => {
  expect(res.headers).to.eql({"Content-Type": "application/json"})
  expect(res.code).to.equal(code);
  if (data) expect(JSON.parse(res.sent)).to.eql({data});
}

const badPageNumbers = {
  "less than 1": -4, 
  "greater than 1000": 1002, 
  "non-numeric": "str", 
  "non-integer": 54.2
};

const badMovieIds = {
  "non-numeric": "str",
  "non-integer": 54.2
}

describe("route handlers", function(){
  describe("POST /api/movies", function(){
    for (let problematic in badMovieIds){
      const movieId = badMovieIds[problematic];
      it(`should 400 if given a movie id that is ${problematic}`, function(){
        let calledNextWithErr = false, res = makeMockRes();
        getMovieDetails(null, {body: {movieId}}, res, err => {
          calledNextWithErr = true;
          expect(err).to.be.an("error");
          expect(err.message).to.contain("movieId")
          ensureRes(res, 400, err.message)
        });
        expect(calledNextWithErr).to.be.true;
      })
    }
    it("should 200 if given a valid movie id", function(){
      let calledNextWithErr = false, res = makeMockRes();
      let movieId;
      const api = {movieInfo: (query, cb) => {
        movieId = query.id;
        cb(null, listData())
      }}
      getMovieDetails(api, {body: {movieId: 10}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      expect(movieId).to.equal(10);
      ensureRes(res, 200)
    })
    it("should 500 if the tmdb api call fails for any reason", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {movieInfo: (query, cb) => cb(new Error)}
      getMovieDetails(api, {body: {movieId: 10}}, res, err => {
        calledNextWithErr = true;
        expect(err).to.be.an("error");
        expect(err.message).to.equal("server error")
        ensureRes(res, 500, err.message)
      });
      expect(calledNextWithErr).to.be.true;
    })
    it("should 200 and send normalized json data to the client", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {movieInfo: (query, cb) => cb(null, detailData())}
      getMovieDetails(api, {body: {movieId: 10}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      ensureRes(res, 200, detailDataNormalized())
    })
  })
  describe("POST /api/popular", function(){
    for (let problematic in badPageNumbers){
      const pageNumber = badPageNumbers[problematic];
      it(`should 400 if given a page number that is ${problematic}`, function(){
        let calledNextWithErr = false, res = makeMockRes();
        getPopularMovies(null, {body: {pageNumber}}, res, err => {
          calledNextWithErr = true;
          expect(err).to.be.an("error");
          expect(err.message).to.contain("pageNumber")
          ensureRes(res, 400, err.message)
        });
        expect(calledNextWithErr).to.be.true;
      })
    }
    it("should 200 if given a valid page number", function(){
      let calledNextWithErr = false, res = makeMockRes();
      let pageNumber;
      const api = {miscPopularMovies: (query, cb) => {
        pageNumber = query.page;
        cb(null, listData())
      }}
      getPopularMovies(api, {body: {pageNumber: 10}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      expect(pageNumber).to.equal(10);
      ensureRes(res, 200)
    })
    it("should 200 and default the unspecified page number to 1", function(){
      let calledNextWithErr = false, res = makeMockRes();
      let pageNumber;
      const api = {miscPopularMovies: (query, cb) => {
        pageNumber = query.page;
        cb(null, listData())
      }}
      getPopularMovies(api, {body: {}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      expect(pageNumber).to.equal(1)
      ensureRes(res, 200)
    })
    it("should 500 if the tmdb api call fails for any reason", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {miscPopularMovies: (query, cb) => cb(new Error)}
      getPopularMovies(api, {body: {pageNumber: 10}}, res, err => {
        calledNextWithErr = true;
        expect(err).to.be.an("error");
        expect(err.message).to.equal("server error")
        ensureRes(res, 500, err.message)
      });
      expect(calledNextWithErr).to.be.true;
    })
    it("should 200 and send normalized json data to the client", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {miscPopularMovies: (query, cb) => cb(null, listData())}
      getPopularMovies(api, {body: {}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      ensureRes(res, 200, listDataNormalized())
    })
  })
  describe("POST /api/search", function(){
    it("should 400 if not given a search term", function(){
      let calledNextWithErr = false, res = makeMockRes();
      searchMovies(null, {body: {}}, res, err => {
        calledNextWithErr = true;
        expect(err).to.be.an("error");
        expect(err.message).to.contain("searchTerm")
        ensureRes(res, 400, err.message)
      });
      expect(calledNextWithErr).to.be.true;
    })
    for (let problematic in badPageNumbers){
      const pageNumber = badPageNumbers[problematic];
      it(`should 400 if given a page number that is ${problematic}`, function(){
        let calledNextWithErr = false, res = makeMockRes();
        searchMovies(null, {body: {searchTerm: "x", pageNumber}}, res, err => {
          calledNextWithErr = true;
          expect(err).to.be.an("error");
          expect(err.message).to.contain("pageNumber")
          ensureRes(res, 400, err.message)
        });
        expect(calledNextWithErr).to.be.true;
      })
    }
    it("should 200 if given a valid page number and search term", function(){
      let calledNextWithErr = false, res = makeMockRes();
      let pageNumber, searchTerm;
      const api = {searchMovie: (query, cb) => {
        pageNumber = query.page;
        searchTerm = query.query;
        cb(null, listData())
      }}
      searchMovies(api, {body: {searchTerm: "x", pageNumber: 10}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      expect(pageNumber).to.equal(10);
      expect(searchTerm).to.equal("x")
      ensureRes(res, 200)
    })
    it("should 200 and default the unspecified page number to 1", function(){
      let calledNextWithErr = false, res = makeMockRes();
      let pageNumber;
      const api = {searchMovie: (query, cb) => {
        pageNumber = query.page;
        cb(null, listData())
      }}
      searchMovies(api, {body: {searchTerm: "x"}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      expect(pageNumber).to.equal(1)
      ensureRes(res, 200)
    })
    it("should 500 if the tmdb api call fails for any reason", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {searchMovie: (query, cb) => cb(new Error)}
      searchMovies(api, {body: {searchTerm: "x", pageNumber: 10}}, res, err => {
        calledNextWithErr = true;
        expect(err).to.be.an("error");
        expect(err.message).to.equal("server error")
        ensureRes(res, 500, err.message)
      });
      expect(calledNextWithErr).to.be.true;
    })
    it("should 200 and send normalized json data to the client", function(){
      let calledNextWithErr = false, res = makeMockRes();
      const api = {searchMovie: (query, cb) => cb(null, listData())}
      searchMovies(api, {body: {searchTerm: "x"}}, res, err => {
        calledNextWithErr = true;
      });
      expect(calledNextWithErr).to.be.false;
      ensureRes(res, 200, listDataNormalized())
    })
  })
})
