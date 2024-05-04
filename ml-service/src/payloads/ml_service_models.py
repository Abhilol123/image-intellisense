from pydantic import BaseModel
from typing import List


class ProcessImageRequest(BaseModel):
    image_url: str


class SearchImagesRequest(BaseModel):
    prompt: str


class SearchImagesResponse(BaseModel):
    image_urls: List[str]
