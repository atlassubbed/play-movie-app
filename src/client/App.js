import React, { Fragment, Component } from "react";
import { render } from "react-dom";
import DetailView from "./detail-view/DetailView";
import ListView from "./list-view/ListView";
import SearchBar from "./search-bar/SearchBar";
import { getQueryParams, setQueryParams, debounce } from "./helpers";
import "./styles.css";

export default class App extends Component {
  constructor(...args){
    super(...args)
    const { movieId, query } = getQueryParams();
    this.handleSearchQuery = debounce(this._handleSearchQuery.bind(this), 500)
    this.state =  { movieId, query: query || "" }
  }
  _renderDetails(){
    const { movieId } = this.state;
    // key here allows us to reset the list using the react keyed diffing algorithm
    // instead of using imperative lifecycle methods
    if (movieId)
      return <DetailView key={movieId} movieId={movieId}/>
  }
  _handleMovieClick(movie){
    setQueryParams({movie});
    this.setState({movieId: movie})
  }
  _handleSearchQuery(query){
    setQueryParams({query});
    this.setState({query});
  }
  _renderSearchList(){
    const { query } = this.state;
    // the performance impact using key is not an issue, because API is paginated
    // so we'll only be mounting/unmounting ~20 nodes on a new query
    // plus, we're debouncing input...
    return (
      <div className="search-container">
        <SearchBar onQuery={this.handleSearchQuery}/>
        <ListView key={query} query={query} onClick={id => this._handleMovieClick(id)}/>
      </div>
    )
  }
  render(){
    return (
      <div className="app-container">
        {this._renderSearchList()}
        {this._renderDetails()}
      </div>
    )
  }
}
