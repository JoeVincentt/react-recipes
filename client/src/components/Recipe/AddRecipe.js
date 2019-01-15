import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { ADD_RECIPE } from "../../queries/index";
import Error from "../Error";

const initialState = {
  name: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};

class AddRecipe extends Component {
  state = initialState;

  componentDidMount() {
    this.setState({ username: this.props.session.getCurrentUser.username });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data);
    });
  };

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App"> Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  value={name}
                  onChange={this.handleChange}
                />
                <select
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>

                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                  placeholder="Add description"
                />
                <textarea
                  type="text"
                  name="instructions"
                  value={instructions}
                  onChange={this.handleChange}
                  placeholder="Add instructions"
                />
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

export default AddRecipe;
