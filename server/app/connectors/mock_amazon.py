from app.connectors.base import StoreConnector
from app.schemas.product import Product
from app.schemas.search import SearchFilters
from app.sources.mock_amazon_source import MockAmazonSource


class MockAmazonConnector(StoreConnector):

    def __init__(self):
        self.source = MockAmazonSource()

    @property
    def store_id(self) -> str:
        return "amazon"

    @property
    def store_name(self) -> str:
        return "Amazon"

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