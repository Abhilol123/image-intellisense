from abc import ABC, abstractmethod


class FileStorage(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save_file(self, file: bytes) -> str:
        pass
