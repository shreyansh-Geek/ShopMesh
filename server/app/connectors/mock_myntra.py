from app.connectors.base import StoreConnector
from app.schemas.product import Product
from app.schemas.search import SearchFilters
from app.sources.mock_myntra_source import MockMyntraSource


class MockMyntraConnector(StoreConnector):

    def __init__(self):
        self.source = MockMyntraSource()

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
    ) -> list[Product]:

        products = self.source.get_products()

        return [
            Product.model_validate(product)
            for product in products
        ]