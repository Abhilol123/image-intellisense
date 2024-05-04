const Express = require("express");
const ImageUploadRouter = require("./ImageUpload");
const ImageSearchRouter = require("./ImageSearch");

const v1Router = Express.Router();

v1Router.use("/image", ImageUploadRouter);

v1Router.use("/search", ImageSearchRouter);

module.exports = v1Router;
