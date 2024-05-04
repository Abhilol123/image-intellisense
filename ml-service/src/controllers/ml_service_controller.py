import os

from src.utils.clip_processor import ClipProcessor
from src.utils.qdrant_helper_client import QdrantHelperClient
from src.utils.config import settings
from src.utils.image_process import download_image
from typing import List
from qdrant_client.models import Record
from src.payloads.ml_service_models import (
    ProcessImageRequest,
    SearchImagesRequest,
    SearchImagesResponse,
)

CDN_LINK = "https://image-cdn.hostname.com"

clip_processor = ClipProcessor()
qdrant_helper_client = QdrantHelperClient(
    host=settings.qdrant_db_host if "QDRANT_DB_HOST" not in os.environ else os.environ["QDRANT_DB_HOST"],
    port=settings.qdrant_db_port,
    collection_name="images_collection",
)


def create_new_collection() -> bool:
    try:
        qdrant_helper_client.create_collection()
        return True
    except Exception as e:
        raise Exception(f"Error in creating collection: {e}")


def get_last_string(url):
    parts = url.split("/")
    return parts[-1]


def add_image_to_collection(process_image_request: ProcessImageRequest) -> bool:
    try:
        image_url = process_image_request.image_url
        downloaded_image = download_image(image_url)
        image_vector = clip_processor.process_image(downloaded_image)
        qdrant_helper_client.store_vectors([Record(id=get_last_string(image_url), vector=image_vector)])
        return True
    except Exception as e:
        raise Exception(f"Error in adding image to collection: {e}")


def get_images_by_prompt(
    search_image_request: SearchImagesRequest,
) -> SearchImagesResponse:
    try:
        prompt = search_image_request.prompt
        prompt_vector = clip_processor.process_text(prompt)
        result_images = qdrant_helper_client.search_vectors(prompt_vector)
        return SearchImagesResponse(image_urls=[f"{CDN_LINK}/{result_image}" for result_image in result_images])
    except Exception as e:
        raise Exception(f"Error in getting images by prompt: {e}")
