const fetch = require('node-fetch');

const MLServiceClient = {}

MLServiceClient.ENDPONT = `http://${process.env.ML_SERVICE_HOST ?? 'localhost'}:${process.env.ML_SERVICE_PORT ?? '8001'}/api/v1/search-images`

MLServiceClient.searchImages = async (query) => {
    try {
        const response = await fetch(MLServiceClient.ENDPONT, {
            method: 'POST',
            body: JSON.stringify({ prompt: query }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error("MLServiceClient.searchImages has failed with error " + response.status);
        }
        return await response.json();
    } catch (err) {
        console.error("MLServiceClient.searchImages has failed with error " + err);
        return null;
    }
}

module.exports = MLServiceClient;
