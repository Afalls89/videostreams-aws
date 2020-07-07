const express = require("express");
const app = express();

const cors = require("cors");

// this server needs to accept cross origin requests from a frontend server that is not on the same domain
app.use(cors());

module.exports = app;
