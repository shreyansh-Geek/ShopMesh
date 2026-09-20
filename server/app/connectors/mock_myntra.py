from app.connectors.base import StoreConnector
from app.schemas.search import SearchFilters
from app.services.product_repository import PRODUCTS


class MockMyntraConnector(StoreConnector):

    @property
    def store_id(self) -> str:
        return "myntra"

    @property
    def store_name(self) -> str:
        return "Myntra"

    async def search(
        self,
        query: str,
        filters: SearchFilters | None = None,
    ) -> list[dict]:

        return [
            product
            for product in PRODUCTS
            if product["store_id"] == "myntra"
        ]

        # --------------------------------
        # Intentionally raising an exception to simulate a store being temporarily unavailable. This is useful for testing error handling in the search service.
        # --------------------------------

        # raise Exception("Myntra temporarily unavailable")