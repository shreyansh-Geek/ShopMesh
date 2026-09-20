from app.connectors.base import StoreConnector

from app.connectors.mock_amazon import MockAmazonConnector
from app.connectors.mock_myntra import MockMyntraConnector
from app.connectors.mock_flipkart import MockFlipkartConnector


class StoreRegistry:

    def __init__(self):
        self._connectors: dict[str, StoreConnector] = {}

    def register(self, connector: StoreConnector) -> None:
        self._connectors[connector.store_id] = connector

    def get(self, store_id: str) -> StoreConnector | None:
        return self._connectors.get(store_id)

    def get_all(self) -> list[StoreConnector]:
        return list(self._connectors.values())


store_registry = StoreRegistry()

store_registry.register(
    MockAmazonConnector()
)

store_registry.register(
    MockMyntraConnector()
)

store_registry.register(
    MockFlipkartConnector()
)