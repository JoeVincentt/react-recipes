import React from "react";
import "./App.css";
import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../queries/index";
import RecipeItem from "./Recipe/RecipeItem";

const App = () => (
  <div className="App">
    <h1 className="main-title">
      Find Recipe You <strong>Love</strong>
    </h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading..</div>;
        if (error) return <div>Error</div>;
        console.log(data);
        return (
          <ul className="cards">
            {data.getAllRecipes.map(recipe => (
              <RecipeItem {...recipe} key={recipe._id} />
            ))}
          </ul>
        );
      }}
    </Query>
  </div>
);

export default App;
