import React, { Fragment, Component } from "react";
import Infinite from "react-infinite";
import ListItem from "./ListItem";
import "./styles.css";

// the list view's search query is controlled,
// but the list view is responsible for acquiring its own data
// and controlling its own pagination.
// could probably have better error handling

// could be DRYer
async function getPopular(pageNumber){
  const res = await fetch("/api/popular", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({pageNumber})
  })
  if (!res.ok) return { movies: [] };
  const { data: { list: movies, page } } = await res.json();
  return { movies };
}

async function searchMovies(pageNumber, searchTerm){
  const res = await fetch("/api/search", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({pageNumber, searchTerm})
  })
  if (!res.ok) return { movies: [] };
  const { data: { list: movies, page } } = await res.json();
  return { movies }; 
}

export default class ListView extends Component {
  constructor(...args){
    super(...args);
    this.state = {page: 0, movies: [], isLoading: true, error: null}
  }
  async componentDidMount(){
    const page = this.state.page + 1;
    const { query } = this.props;
    let error, { movies } = await (query ? searchMovies(page, query) : getPopular(page));
    if (!movies.length) error = "no matches"
    this.setState({page, movies, isLoading: false, error});     
  }
  async _getMorePosts(){
    const state = this.state;
    const page = state.page + 1;
    if (state.isLoading) return;
    this.setState({isLoading: true});
    const { movies } = await getPopular(page);
    this.setState({page, movies: [...state.movies, ...movies], isLoading: false});
  }
  _renderMovies(onClick){
    return this.state.movies.map(movie => {
      return <ListItem key={movie.id} movie={movie} onClick={onClick}/>
    })
  }
  render(props){
    const { isLoading, error } = this.state;
    return (
      <Infinite 
        className="list-container"
        infiniteLoadBeginEdgeOffset={250}
        // or we could use bind in constructor
        onInfiniteLoad={() => this._getMorePosts()}
        isInfiniteLoading={isLoading}
        loadingSpinnerDelegate={"loading..."}
        useWindowAsScrollContainer={true}
        elementHeight={100}
      >
        {error ? isLoading || error : this._renderMovies(this.props.onClick)}
      </Infinite>
    )
  }
}
