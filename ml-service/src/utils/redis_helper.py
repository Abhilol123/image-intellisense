import json
import logging
from typing import List

import redis

from src.utils.config import settings

import os


class RedisQueue:
    def __init__(self) -> None:
        connection_string = {
            "host": settings.redis_host if "REDIS_HOST" not in os.environ else os.environ["REDIS_HOST"],
            "port": int(settings.redis_port),
        }

        self.db = redis.Redis(**connection_string)
        try:
            self.db.ping()
            logging.info(f"Connected to redis successfully ...")
        except Exception as e:
            logging.error(f"Error connecting to redis: {e}")

    @staticmethod
    def ping():
        connection_string = {
            "host": settings.redis_host if "REDIS_HOST" not in os.environ else os.environ["REDIS_HOST"],
            "port": int(settings.redis_port),
        }
        redis_db = redis.Redis(**connection_string)
        try:
            redis_db.ping()
            logging.info(f"Connected to redis successfully ...")
            return True
        except Exception as e:
            logging.error(f"Error connecting to redis: {e}")
            return False

    def redis_queue_push(self, queue_name, message: dict) -> bool:
        try:
            self.db.lpush(queue_name, json.dumps(message))
            return True
        except Exception as e:
            logging.error(f"Error pushing to redis queue: {e}")
            return False

    def redis_queue_push_front(self, queue_name, message: str) -> bool:
        try:
            self.db.rpush(queue_name, message)
            return True
        except Exception as e:
            logging.error(f"Error pushing to redis queue: {e}")
            return False

    def redis_get_task(self, task_queue: List[str]):
        try:
            output = self.db.brpop(task_queue, 10)
            if isinstance(output, type(None)):
                return None
            else:
                _, message_json = output
                return message_json
        except Exception as e:
            logging.error(f"Error getting task from redis: {e}", exc_info=True)
            return None

    def redis_pop_task(self, task_queue: str):
        try:
            output = self.db.brpop(task_queue, 10)
            if isinstance(output, type(None)):
                return None
            else:
                _, message_json = output
                return message_json
        except Exception as e:
            logging.error(f"Error popping task from redis: {e}", exc_info=True)
            return None
