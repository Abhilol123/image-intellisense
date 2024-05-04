const PGUtils = require("./PGUtils");

const Queries = {};

Queries.getImageDataById = async (imageUrl) => {
	let getImageDataByIdQueryText = `
		SELECT id, image_url, width, height, metadata, created_at, updated_at
		FROM public.uploaded_images
		WHERE image_url = '${imageUrl}'
	;`;

	let err, getImageDataByIdResult = await PGUtils.readQuery({ text: getImageDataByIdQueryText });
	if (err) {
		console.error("Error: Queries.getImageDataById failed with error: ", err);
		return;
	}
	return getImageDataByIdResult;
}

Queries.insertUploadedImage = async (uploadedImage) => {
	let insertUploadedImageQueryText = `
		INSERT INTO public.uploaded_images (id, image_url, width, height, metadata)
		VALUES ('${uploadedImage.id}', '${uploadedImage.image_url}', ${uploadedImage.width}, ${uploadedImage.height}, '${uploadedImage.metadata}')
		RETURNING id, image_url, width, height, metadata, created_at, updated_at
	;`;

	let err, insertUploadedImageResult = await PGUtils.writeQuery({ text: insertUploadedImageQueryText });
	if (err) {
		console.error("Error: Queries.insertUploadedImage failed with error: ", err);
		return;
	}
	return insertUploadedImageResult;
}

Queries.insertUserQueryLogs = async (userQueryLog) => {
	let insertUserQueryLogsQueryText = `
		INSERT INTO public.user_query_logs (query, images)
		VALUES ('${userQueryLog.query}', '${userQueryLog.user_id}')
		RETURNING id, query, images, created_at
	;`;

	let err, insertUserQueryLogsResult = await PGUtils.writeQuery({ text: insertUserQueryLogsQueryText });
	if (err) {
		console.error("Error: Queries.insertUserQueryLogs failed with error: ", err);
		return;
	}
	return insertUserQueryLogsResult;
}

module.exports = Queries;
