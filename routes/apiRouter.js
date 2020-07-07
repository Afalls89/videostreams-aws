const apiRouter = require("express").Router();

const { sendAllEndpoints } = require("../controllers/api_controller");

// this route will provide a json file with all the available endpoints
apiRouter.route("/").get(sendAllEndpoints);

// this route will be called to when a stream is requesting to be started
apiRouter.route("/startstream/:user_id").get(getNewStream);

// this route will be called to when a stream has ended
apiRouter.route("/endstream/:user_id").get(getEndStream);

module.exports = apiRouter;
