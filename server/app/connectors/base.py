from abc import ABC, abstractmethod

from app.schemas.search import SearchFilters


class StoreConnector(ABC):

    @property
    @abstractmethod
    def store_id(self) -> str:
        pass

    @property
    @abstractmethod
    def store_name(self) -> str:
        pass

    @abstractmethod
    async def search(
        self,
        query: str,
        filters: SearchFilters | None = None,
    ) -> list[dict]:
        pass