const v1Router = require("./v1");
const Express = require("express");

const Router = Express.Router();

Router.get("/health", (req, res) => {
	res.status(200).send("OK");
});

Router.use("/v1", v1Router);

module.exports = Router;
