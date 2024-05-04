const Express = require("express");
const ImageUploadHelper = require("./ImageSearchHelper");

const ImageUploadRouter = Express.Router();

/**
 * Search for image from library images
 */
ImageUploadRouter.post("/search", async (req, res, next) => {
	if (!req.body.prompt) {
		return res.status(400).send({ status: "BAD_REQUEST", errorMessage: "Prompt is required." });
	}
	try {
		const response = await ImageUploadHelper.search(req.body.prompt);
		return res.status(200).send(response);
	} catch (err) {
		console.error("Error: search images failed with error: ", err);
		return res.status(500).send({ status: "INTERNAL_SERVER_ERROR", errorMessage: "Something went wrong. Please try again later." });
	}
});

module.exports = ImageUploadRouter;
