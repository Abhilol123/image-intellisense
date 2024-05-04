const fetch = require('node-fetch');
const fs = require('fs');

const UploadServiceClient = {}

UploadServiceClient.ENDPONT = `http://${process.env.UPLOAD_SERVICE_HOST ?? 'localhost'}:${process.env.UPLOAD_SERVICE_PORT ?? '5001'}/upload`

const saveFileToDisk = async (file, fileName) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, file.data, (err) => {
			if (err) {
				reject(err);
				console.error('Error saving the file:', err);
			} else {
				resolve(fileName);
				console.log('File saved successfully!');
			}
		});
	});
}

const streamToBlob = (readStream, contentType) => {
	return new Promise((resolve, reject) => {
		const chunks = [];

		readStream.on('data', (chunk) => {
			chunks.push(chunk);
		});

		readStream.on('end', () => {
			const blob = new Blob(chunks, { type: contentType });
			resolve(blob);
		});

		readStream.on('error', (error) => {
			reject(error);
		});
	});
}

const readFileAsBase64 = async (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
				console.error('Error loading the file:', err);
			} else {
				resolve(data.toString('base64'));
				console.log('File loaded successfully!');
			}
		});
	});
}

UploadServiceClient.upload = async (file) => {
	try {
		const filePath = await saveFileToDisk(file.files, `tmp/${file.files.name}`);
		const newFile = fs.createReadStream(filePath);
		const blob = await streamToBlob(newFile, file.files.mimetype);
		const formData = new FormData();
		formData.append('file', blob);
		const response = await fetch(UploadServiceClient.ENDPONT, {
			method: 'POST',
			body: formData,
		});
		if (!response.ok) {
			throw new Error("UploadServiceClient.upload has failed with error " + response.status);
		}
		return await response.json();
	} catch (err) {
		throw new Error("UploadServiceClient.upload has failed with error " + err);
	}
}

UploadServiceClient.uploadBase64 = async (file) => {
	try {
		const response = await fetch(`${UploadServiceClient.ENDPONT}/base64`, {
			method: 'POST',
			body: JSON.stringify({ file: file }),
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response.ok) {
			throw new Error("UploadServiceClient.upload has failed with error " + response.status);
		}
		return await response.json();
	} catch (err) {
		throw new Error("UploadServiceClient.upload has failed with error " + err);
	}
}

module.exports = UploadServiceClient;
