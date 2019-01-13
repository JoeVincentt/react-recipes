const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const Recipe = require("./models/Recipe");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

//Connect to Database and start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    })
  );
