const Queries = require("APIHelper/Queries");
const UploadServiceClient = require("../../../Clients/UploadServiceClient");
const RedisUtils = require("APIHelper/RedisUtils");

const ImageUploadHelper = {};

const IMAGE_CDN_LINK = process.env.IMAGE_CDN_LINK ?? "https://image-cdn.hostname.com";

const IMAGE_PROCESS_QUEUE_NAME = process.env.IMAGE_PROCESS_QUEUE_NAME ?? "image_process_queue";

ImageUploadHelper.upload = async (files) => {
	const image_id = await UploadServiceClient.upload(files);
	const imageUploadDetails = await Queries.insertUploadedImage({
		id: image_id,
		image_url: `${IMAGE_CDN_LINK}/${image_id}`,
		width: 0,
		height: 0,
		metadata: "",
	});
	if (!imageUploadDetails) {
		throw new Error("Error: ImageUploadHelper.upload failed with error: ");
	}
	if (imageUploadDetails.length < 1 || !imageUploadDetails[0]) {
		throw new Error("Error: ImageUploadHelper.upload failed with error: ");
	}
	return { status: "SUCCESS", data: imageUploadDetails };
}

ImageUploadHelper.uploadBase64 = async (file) => {
	const image_id = await UploadServiceClient.uploadBase64(file);
	const imageUploadDetails = await Queries.insertUploadedImage({
		id: image_id.file_path,
		image_url: `${IMAGE_CDN_LINK}/${image_id.file_path}`,
		width: 0,
		height: 0,
		metadata: "",
	});
	if (!imageUploadDetails) {
		throw new Error("Error: ImageUploadHelper.upload failed with error: ");
	}
	if (imageUploadDetails.length < 1 || !imageUploadDetails[0]) {
		throw new Error("Error: ImageUploadHelper.upload failed with error: ");
	}
	const redisPushResult = await RedisUtils.pushToQueue(IMAGE_PROCESS_QUEUE_NAME, imageUploadDetails[0].image_url);
	if (!redisPushResult) {
		throw new Error("Error: RedisUtils.pushToQueue failed");
	}
	return { status: "SUCCESS", data: imageUploadDetails[0].image_url };
}

module.exports = ImageUploadHelper;
