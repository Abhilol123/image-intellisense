from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, Record, ScoredPoint
from typing import List
import logging


class QdrantHelperClient:
    def __init__(self, host: str, port: str, collection_name: str) -> None:
        self.qdrant_client = QdrantClient(f"http://{host}:{port}")
        self.collection_name = collection_name
        return None

    def create_collection(self, size=512, distance=Distance.COSINE) -> bool:
        try:
            self.qdrant_client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=size, distance=distance),
            )
            return True
        except Exception as e:
            logging.error(f"Error in creating collection: {e}")
            raise Exception(f"Error in creating collection: {e}")

    def store_vectors(self, points: List[Record]) -> bool:
        logging.info(f"Storing vectors: {points}, {self.collection_name}")
        try:
            self.qdrant_client.upsert(collection_name=self.collection_name, points=points, wait=True)
            return True
        except Exception as e:
            logging.error(f"Error in storing vectors: {e}")
            raise Exception(f"Error in storing vectors: {e}")

    def search_vectors(
        self,
        vector: List[float],
        limit: int = 10,
        offset: int = 0,
        score_threshold: float = None,
    ) -> List[str]:
        try:
            response: List[ScoredPoint] = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=vector,
                limit=limit,
                offset=offset,
                score_threshold=score_threshold,
            )
            response.sort(key=lambda x: x.score, reverse=True)
            return [result.id for result in response]
        except Exception as e:
            logging.error(f"Error in searching vectors: {e}")
            raise Exception(f"Error in searching vectors: {e}")
