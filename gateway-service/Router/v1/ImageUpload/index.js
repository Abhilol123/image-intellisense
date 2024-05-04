const Express = require("express");
const ImageUploadHelper = require("./ImageUploadHelper");

const ImageUploadRouter = Express.Router();

/**
 * Post for uploading images
 */
ImageUploadRouter.post("/upload/file", async (req, res, next) => {
	try {
		const response = await ImageUploadHelper.upload(req.files);
		return res.status(200).send(response);
	} catch (err) {
		console.error("Error: upload file failed with error: ", err);
		return res.status(500).send({ status: "INTERNAL_SERVER_ERROR", errorMessage: "Something went wrong. Please try again later." });
	}
});

/**
 * Post for uploading base64 images
 */
ImageUploadRouter.post("/upload/base64", async (req, res, next) => {
	if (!req.body?.file) {
		return res.status(400).send({ status: "BAD_REQUEST", errorMessage: "Missing file" });
	}
	try {
		const response = await ImageUploadHelper.uploadBase64(req.body.file);
		return res.status(200).send(response);
	} catch (err) {
		console.error("Error: upload base64 failed with error: ", err);
		return res.status(500).send({ status: "INTERNAL_SERVER_ERROR", errorMessage: "Something went wrong. Please try again later." });
	}
});

module.exports = ImageUploadRouter;
