from PIL import Image
import io
import logging
import requests


def download_image(image_url: str) -> Image.Image:
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content))
        return image
    except (requests.RequestException, OSError) as e:
        logging.error(f"Error downloading image from {image_url}: {e}")
        raise e
