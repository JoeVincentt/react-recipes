const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Recipe = require("./models/Recipe");
const User = require("./models/User");

//Bring in GraphQL middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

//Create GraphQL Schema
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

//MIDDLEWARE IN USE
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

//Set uop JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (error) {
      console.log("Token not found");
    }
  }
  next();
});

//Create GraphQL application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

//Connect Schemas with graphQL
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

//Connect to Database and start Server

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    })
  );
