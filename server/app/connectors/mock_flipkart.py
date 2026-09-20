from app.connectors.base import StoreConnector
from app.schemas.product import Product
from app.schemas.search import SearchFilters
from app.services.product_repository import PRODUCTS


class MockFlipkartConnector(StoreConnector):

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

        products = [
            product
            for product in PRODUCTS
            if product["store_id"] == "flipkart"
        ]

        return [
            Product.model_validate(product)
            for product in products
        ]