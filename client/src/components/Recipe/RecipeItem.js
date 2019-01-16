import React from "react";
import { Link } from "react-router-dom";

const RecipeItem = ({ _id, imageUrl, name, category }) => (
  <li
    style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
    className="card"
  >
    <span className={category}>{category}</span>
    <div className="card-text">
      <Link to={`/recipes/${_id}`}>
        <h3>{name}</h3>
      </Link>
    </div>
  </li>
);

export default RecipeItem;
