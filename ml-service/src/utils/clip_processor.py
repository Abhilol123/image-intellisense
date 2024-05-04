from typing import List

import clip
import torch
from PIL import Image


class ClipProcessor:
    def __init__(self, model_name="ViT-B/32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.preprocess = clip.load(model_name, device=self.device)

    def process_image(self, image: Image.Image) -> List[int]:
        with torch.no_grad():
            image_data = self.preprocess(image).unsqueeze(0).to(self.device)
            image_features = self.model.encode_image(image_data)
            image_features = image_features.cpu().numpy().flatten().tolist()
        return image_features

    def process_text(self, text: str) -> List[int]:
        clipped_text = clip.tokenize(text).to(self.device)
        with torch.no_grad():
            text_features = self.model.encode_text(clipped_text)
            text_features = text_features.cpu().numpy().flatten().tolist()
        return text_features
