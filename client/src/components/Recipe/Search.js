import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPE } from "../../queries/index";

import SearchItem from "./SearchItem";

class Search extends Component {
  state = {
    searchResults: []
  };

  handleChange = ({ searchRecipe }) => {
    this.setState({
      searchResults: searchRecipe
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="search"
              placeholder="Search Recipes..."
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_RECIPE,
                  variables: { searchTerm: event.target.value }
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(recipe => (
                <SearchItem key={recipe._id} {...recipe} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}
export default Search;
