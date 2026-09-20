from app.connectors.base import StoreConnector
from app.schemas.product import Product
from app.schemas.search import SearchFilters
from app.services.product_repository import PRODUCTS


class MockAmazonConnector(StoreConnector):

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

        products = [
            product
            for product in PRODUCTS
            if product["store_id"] == "amazon"
        ]

        return [
            Product.model_validate(product)
            for product in products
        ]