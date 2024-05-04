import logging

logging.basicConfig(level=logging.INFO)

import uvicorn
from fastapi import FastAPI
from fastapi_health import health
from src.route.ml_service import postRouter
from src.image_queue_handler.image_queue_handler import imageQueueHandler
import os
import threading
import asyncio


app = FastAPI()


def isServerLive() -> bool:
    return True


app.add_api_route("/health", health([isServerLive]))

app.include_router(postRouter)


def worker_process(*args, **kwargs):
    imageQueueHandler()


@app.on_event("startup")
def startup_event():
    logging.info("Server started")


@app.on_event("shutdown")
def shutdown_event():
    logging.info("Server stopped")


@app.on_event("startup")
def start_consumer():
    threading.Thread(target=worker_process, daemon=True).start()
    loop = asyncio.get_event_loop()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
