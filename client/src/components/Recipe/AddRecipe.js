import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  ADD_RECIPE,
  GET_ALL_RECIPES,
  GET_USER_RECIPES
} from "../../queries/index";
import CKEditor from "react-ckeditor-component";
import Error from "../Error";
import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";

const initialState = {
  name: "",
  imageUrl: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};

class AddRecipe extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({ username: this.props.session.getCurrentUser.username });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid =
      !name || !category || !description || !instructions || !imageUrl;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  render() {
    const {
      name,
      imageUrl,
      category,
      description,
      instructions,
      username
    } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          imageUrl,
          category,
          description,
          instructions,
          username
        }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App"> Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <label htmlFor="name">Recipe Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Add Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <label htmlFor="imageUrl">Recipe Image</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Add Image URL"
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <label htmlFor="category">Category of Recipe</label>
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <label htmlFor="description">Recipe Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="instructions">Add instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                />
                {/* <textarea
                  type="text"
                  name="instructions"
                  value={instructions}
                  onChange={this.handleChange}
                  placeholder="Add instructions"
                /> */}
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
