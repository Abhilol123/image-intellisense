from src.utils.redis_helper import RedisQueue
from src.controllers.ml_service_controller import add_image_to_collection
from src.payloads.ml_service_models import ProcessImageRequest
import logging

REDIS_IMAGE_QUEUE_NAME = "image_process_queue"


def imageQueueHandler():
    redisQueue = RedisQueue()
    while True:
        try:
            imageURL = redisQueue.redis_get_task([REDIS_IMAGE_QUEUE_NAME])
            if imageURL is None:
                continue
            else:
                logging.info(f"Image URL received: {imageURL}")
            add_image_to_collection(ProcessImageRequest(image_url=imageURL))
        except Exception as e:
            logging.error(f"Error in imageQueueHandler: {e}")
            continue
