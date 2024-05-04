const API_URL = "https://image-gateway.hostname.com"

const convertFileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
    });
}

document.getElementById("upload-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const files = document.getElementById("fileInput")?.files;
    const uploadRequests = [];
    try {
        Object.keys(files).map(async (file) => {
            const fileBase64 = await convertFileToBase64(files[file]);
            uploadRequests.push(fetch(`${API_URL}/v1/image/upload/base64`, {
                method: 'POST',
                body: JSON.stringify({ file: fileBase64 }),
                headers: { 'Content-Type': 'application/json' },
            }));
        });
        const results = await Promise.all(uploadRequests);
        return;
    } catch (error) {
        alert("Error in uploading file.");
        console.error("Error in uploading file: ", error);
    }
});

document.getElementById("search-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const searchResult = document.getElementById("search-result");
    const prompt = document.getElementById("fileSearchInput")?.value.trim();

    try {
        const searchImagesResponse = await fetch(`${API_URL}/v1/search/search`, {
            method: 'POST',
            body: JSON.stringify({ prompt: prompt }),
            headers: { 'Content-Type': 'application/json' },
        });
        const response = await searchImagesResponse.json();
        const imageUrl = response.data;
        if (imageUrl.length > 0) {
            searchResult.innerHTML = imageUrl.map((url) => (`<img src="${url}" alt="Image" class="img-fluid">`)).join("");
        } else {
            searchResult.innerHTML = `<p>No image found for "${prompt}".</p>`;
        }
    } catch (error) {
        searchResult.innerHTML = `<p>Error for "${prompt}".</p>`;
        console.error("Error in searching file: ", error);
    }
    return;
});
