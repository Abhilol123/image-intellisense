import logging
from typing import List

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.payloads.ml_service_models import (
    ProcessImageRequest,
    SearchImagesRequest,
    SearchImagesResponse,
)

from src.controllers.ml_service_controller import (
    create_new_collection,
    add_image_to_collection,
    get_images_by_prompt,
)

postRouter = APIRouter()


@postRouter.post("/api/v1/generate-collection")
def generate_collection() -> JSONResponse:
    try:
        logging.info("generate-collection request received")
        create_new_collection()
        return JSONResponse(content={"message": "Success"}, status_code=200)
    except Exception as e:
        logging.error(f"generate-collection failed with error: {str(e)}")
        return JSONResponse(content={"message": "internal server error"}, status_code=500)


@postRouter.post("/api/v1/add-image")
def generate_collection(process_image_request: ProcessImageRequest) -> JSONResponse:
    try:
        logging.info("add-image request received")
        add_image_to_collection(process_image_request)
        return JSONResponse(content={"message": "Success"}, status_code=200)
    except Exception as e:
        logging.error(f"add-image failed with error: {str(e)}")
        return JSONResponse(content={"message": "internal server error"}, status_code=500)


@postRouter.post("/api/v1/search-images")
def generate_collection(
    search_image_request: SearchImagesRequest,
) -> SearchImagesResponse:
    try:
        logging.info("search-images request received")
        return get_images_by_prompt(search_image_request)
    except Exception as e:
        logging.error(f"search-images failed with error: {str(e)}")
        return JSONResponse(content={"message": "internal server error"}, status_code=500)
