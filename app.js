const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const cors = require("cors");

// this server needs to accept cross origin requests from a frontend server that is not on the same domain
app.use(cors());

app.use("/api", apiRouter);

module.exports = app;
