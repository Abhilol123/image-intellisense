const Queries = require("APIHelper/Queries");
const MLServiceClient = require("../../../Clients/MLServiceClient");

const ImageSearchHelper = {};

ImageSearchHelper.search = async (prompt) => {
	const imageSearchResult = await MLServiceClient.searchImages(prompt);
	const imageUrls = imageSearchResult.image_urls;
	const imageUploadDetails = await Queries.insertUserQueryLogs({
		query: prompt,
		images: imageUrls.join(","),
	});
	if (!imageUploadDetails) {
		throw new Error("Error: ImageSearchHelper.insert failed with error: ");
	}
	if (imageUploadDetails.length < 1 || !imageUploadDetails[0]) {
		throw new Error("Error: ImageSearchHelper.upload failed with error: ");
	}
	return { status: "SUCCESS", data: imageUrls };
}

module.exports = ImageSearchHelper;
