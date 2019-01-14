import React from "react";
import { Link } from "react-router-dom";

const RecipeItem = ({ _id, name, category }) => (
  <li>
    <Link to={`/recipes/${_id}`}>
      <h3>{name}</h3>
    </Link>
    <p>
      {" "}
      <strong>{category}</strong>{" "}
    </p>
  </li>
);

export default RecipeItem;
