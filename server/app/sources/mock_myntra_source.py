from app.services.product_repository import PRODUCTS


class MockMyntraSource:

    def get_products(self) -> list[dict]:
        return [
            product
            for product in PRODUCTS
            if product["store_id"] == "myntra"
        ]