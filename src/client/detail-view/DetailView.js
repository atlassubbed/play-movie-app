import React, { Fragment, Component } from "react";
import { render } from "react-dom";
import { MovieStat, Tags } from "./Helpers";
import { getPosterURL, getInfoURL, toDate } from "../helpers";
import "./styles.css";

// the detail view's movieId is controlled,
// but the detail view is responsible for acquiring its own data
// could probably have better error handling
//   * retry request on a certain kind of http error
//   * give up and render error on other http errors

async function getMovieDetails(movieId){
  const res = await fetch("/api/movies", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({movieId})
  })
  if (!res.ok) return null;
  const { data: movie } = await res.json();
  return movie;
}

export default class DetailView extends Component {
  constructor(...args){
    super(...args);
    this.state = {error: null, data: null}
  }
  async componentDidMount(){
    const { movieId } = this.props;
    const data = await getMovieDetails(movieId);
    if (!data) return this.setState({error: "couldn't find that movie"});
    this.setState({data})
  }
  // could easily prettify numbers $4000000 -> $4M or at least $4,000,000
  _renderDetails(error, data){
    if (error) return  <MovieStat className="center">{error}</MovieStat>
    if (!data) return <MovieStat className="center">loading...</MovieStat>
    const moreInfoURL = getInfoURL(data.homepage, data.imdb);
    const posterImgURL = getPosterURL(data.poster);
    return (
      <Fragment>
        <div key="title" className="movie-title center">
          <h2>{data.title}</h2>
          <div className="movie-info">
            <MovieStat>{toDate(data.date)}</MovieStat>
            {moreInfoURL && <MovieStat><a href={moreInfoURL}>more info...</a></MovieStat>}
          </div>
        </div>
        <div key="stats-1" className="movie-stats">
          <MovieStat>Score: {data.score}/10</MovieStat>
          <MovieStat>Votes: {data.votes}</MovieStat>
          <MovieStat>Status: {data.status}</MovieStat>
        </div>
        <div key="stats-2" className="movie-stats">
          <MovieStat>Budget: ${data.budget}</MovieStat>
          <MovieStat>Revenue: ${data.revenue}</MovieStat>
          <MovieStat>Duration: {data.duration}min</MovieStat>
        </div>
        {data.genres.length && <div key="tags" className="movie-stats tags">
          <Tags tags={data.genres.map(g => g.name.toLowerCase())}/>
        </div>}
        <div className="movie-info">
          {posterImgURL && <img className="movie-stat" src={posterImgURL}/>}
          <div className="movie-title">
            {data.tagline && <h4 className="center">{data.tagline}</h4>}
            <div className="movie-stat">{data.overview}</div>
          </div>
        </div>
      </Fragment>
    )
  }
  render(props){
    const { error, data } = this.state;
    return (
      <div className="detail-container">
        {this._renderDetails(error, data)}
      </div>
    )
  }
}
