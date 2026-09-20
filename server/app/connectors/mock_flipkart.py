from app.connectors.base import StoreConnector
from app.schemas.product import Product
from app.schemas.search import SearchFilters
from app.sources.mock_flipkart_source import MockFlipkartSource


class MockFlipkartConnector(StoreConnector):

    def __init__(self):
        self.source = MockFlipkartSource()

    @property
    def store_id(self) -> str:
        return "flipkart"

    @property
    def store_name(self) -> str:
        return "Flipkart"

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