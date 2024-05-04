from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from typing import Tuple, Dict
from storage.local_file_storage import LocalFileStorage
import os
import base64
from pydantic import BaseModel
import uvicorn
import logging

app = FastAPI()

LOCAL_UPLOAD_FOLDER: str = os.environ.get("UPLOAD_PATH", "/uploads")

file_storage = LocalFileStorage(base_path=LOCAL_UPLOAD_FOLDER)

ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "gif"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class UploadImageBase64Request(BaseModel):
    file: str


@app.get("/health")
def health_check() -> JSONResponse:
    return JSONResponse(content={"message": "OK"}, status_code=200)


@app.post("/upload/")
async def upload_file(file: UploadFile) -> JSONResponse:
    if not file:
        raise HTTPException(status_code=400, detail="No file part")
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No selected file")
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file format")
    try:
        file_path = file_storage.save_file(file.file)
        return JSONResponse(
            content={"message": "File uploaded successfully", "file_path": file_path},
            status_code=200,
        )
    except Exception as e:
        logging.error(f"Failed to upload file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


@app.post("/upload/base64/")
async def upload_base64_file(file_base64: UploadImageBase64Request) -> JSONResponse:
    try:
        file_data = base64.b64decode(file_base64.file)
        file_path: str = file_storage.save_file(file_data)
        logging.info(f"Base64 file uploaded successfully: {file_path}")
        return JSONResponse(
            content={
                "message": "Base64 file uploaded successfully",
                "file_path": file_path,
            },
            status_code=200,
        )
    except Exception as e:
        logging.error(f"Failed to upload file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
