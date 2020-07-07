const endpoints = require("../endpoints.json");

exports.sendAllEndpoints = (req, res, next) => {
  return res.status(200).send(endpoints);
};
