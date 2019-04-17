import React, { Component } from "react";
import "./styles.css";

export default class SearchBar extends Component {
  render(){
    const { onQuery } = this.props;
    return (
      <div>
        <input 
          className="search-input" type="text"
          placeholder="find a movie..."
          onChange={e => onQuery(e.target.value.trim())}
        />
      </div>
    )
  }
}
