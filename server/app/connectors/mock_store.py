from app.connectors.base import StoreConnector
from app.schemas.search import SearchFilters
from app.services.product_repository import PRODUCTS


class MockStoreConnector(StoreConnector):

    @property
    def store_id(self) -> str:
        return "mock"

    @property
    def store_name(self) -> str:
        return "Mock Store"

    async def search(
        self,
        query: str,
        filters: SearchFilters | None = None,
    ) -> list[dict]:
        return PRODUCTS