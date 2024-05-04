import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    log_level: str = "DEBUG" if "LOG_LEVEL" not in os.environ else "ERROR"
    qdrant_db_host: str
    qdrant_db_port: str
    redis_host: str
    redis_port: str

    class Config:
        env_file = ".env"


settings = Settings()
