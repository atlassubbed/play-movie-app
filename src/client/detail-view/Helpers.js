import React, { Component } from "react"
import "./styles.css"

const MovieStat = ({children, className = ""}) => {
  className = className + " movie-stat"
  return <div className={className}>{children}</div>
}

const Tags = props => {
  const tags = props.tags || [];
  return tags.map(tag => <MovieStat key={tag} className="tag">{tag}</MovieStat>);
} 

export { MovieStat, Tags }