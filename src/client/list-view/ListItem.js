import React, { Fragment, Component } from "react";
import { getPosterURL, toDate } from "../helpers";
import "./styles.css";

const ListItem = ({movie: {id, poster, title, date, score}, onClick}) => (
  <div className="list-item" key={id} onClick={() => onClick(id)}>
    <img className="list-item-image" src={getPosterURL(poster, 92)}></img>
    <div className="list-item-body">
      <h4 className="list-item-title">{title}</h4>
      <span>{toDate(date)}</span>
      <span>{score}/10</span>
    </div>
  </div>
)

export default ListItem;
