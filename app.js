const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const cors = require("cors");
const { handle500s, handle400s } = require("./errors/errors");

app.use("/api", apiRouter);

// if app receives a path that doesn't start with /api it will respond with - Route not found
app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found" })
);

// Error handling middleware
app.use(handle400s);
app.use(handle500s);

module.exports = app;
