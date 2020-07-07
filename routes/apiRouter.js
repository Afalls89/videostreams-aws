const apiRouter = require("express").Router();
const {
  getNewStream,
  getEndStream,
} = require("../controllers/streams_controller");
const { handle405s } = require("../errors/errors");

const { sendAllEndpoints } = require("../controllers/api_controller");

// this route will provide a json file with all the available endpoints
apiRouter.route("/").get(sendAllEndpoints).all(handle405s);

// this route will be called to when a stream is requesting to be started
apiRouter.route("/startstream/:user_id").get(getNewStream).all(handle405s);

// this route will be called to when a stream has ended
apiRouter.route("/endstream/:user_id").get(getEndStream).all(handle405s);

module.exports = apiRouter;
