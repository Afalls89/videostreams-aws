const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const cors = require("cors");

// this server needs to accept cross origin requests from a frontend server that is not on the same domain
app.use(cors());

app.use("/api", apiRouter);

// if app receives a path that doesn't start with /api it will respond with - Route not found
app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found" })
);

module.exports = app;
