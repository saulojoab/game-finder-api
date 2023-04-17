const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("OK Computer - Connected to the database");
  })
  .catch((err) => {
    console.log("OKNOTOK - Something went wrong, check error:");
    console.log(err);
  });

app.get("/", (req, res) => res.send("OK Computer - GameFinder API (2023)"));
app.use(routes);

module.exports = app;
