const { fetchNewStream, fetchEndStream } = require("../models/streams_models");

exports.getNewStream = (req, res, next) => {
  // user_id which was taken from the parametric endpoint
  // is take from the request parameters
  const user_id = req.params.user_id;
  // if the user has less than three active streams the fetchNewStream function
  // will return an object with a key of isNewStreamAllowed that will have a value of true
  // if the user already has three streams it will have a value of false
  fetchNewStream(user_id)
    .then((streamStatus) => {
      res.status(200).send(streamStatus);
    })
    .catch(next);
};

exports.getEndStream = (req, res, next) => {
  // user_id which was taken from the parametric endpoint
  // is take from the request parameters
  const user_id = req.params.user_id;
  // if user has an active stream the fetchEndStream function will return
  // an objet with a key of msg, that will have a value of "stream closed"
  fetchEndStream(user_id)
    .then((streamStatus) => {
      res.status(200).send(streamStatus);
    })
    .catch(next);
};
