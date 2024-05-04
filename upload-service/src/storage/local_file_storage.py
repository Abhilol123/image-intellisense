import os
import uuid
from storage.file_storage import FileStorage


class LocalFileStorage(FileStorage):
    def __init__(self, base_path: str):
        self.base_path = base_path

    def save_file(self, file: bytes) -> str:
        if not os.path.exists(self.base_path):
            os.makedirs(self.base_path)

        new_filename = str(uuid.uuid4())

        file_path: str = os.path.join(self.base_path, new_filename)
        with open(file_path, "wb") as output_file:
            output_file.write(file)
        return new_filename
