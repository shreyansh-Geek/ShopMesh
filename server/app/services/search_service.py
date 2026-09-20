from app.schemas.search import SearchFilters
from app.connectors.registry import store_registry
import asyncio

def calculate_relevance_score(
    product: dict,
    query: str,
) -> int:
    query_lower = query.lower().strip()

    title = product["title"].lower()
    brand = product["brand"].lower()
    category = product["category"].lower()
    store_name = product["store_name"].lower()

    score = 0

    # Exact title match
    if query_lower == title:
        score += 10

    # Query word matching
    for word in query_lower.split():
        if len(word) <= 2:
            continue

        if word in title:
            score += 5

        if word in brand:
            score += 4

        if word in category:
            score += 3

        if word in store_name:
            score += 1

    return score

async def search_store(
    connector,
    query: str,
    filters: SearchFilters | None = None,
) -> tuple[bool, list[dict]]:
    try:
        products = await connector.search(
            query=query,
            filters=filters,
        )

        return True, products

    except Exception as exc:
        print(
            f"Store search failed: "
            f"{connector.store_name} - {exc}"
        )

        return False, []
    
async def search_products(
    query: str,
    filters: SearchFilters | None = None,
    sort_by: str = "relevance",
    stores: list[str] | None = None,
) -> list[dict]:

    # --------------------------------
    # Search all stores concurrently
    # --------------------------------

    if stores:
        connectors = [
            connector
            for connector in store_registry.get_all()
            if connector.store_id in stores
        ]
    else:
        connectors = store_registry.get_all()

    store_results = await asyncio.gather(
    *[
        search_store(
            connector=connector,
            query=query,
            filters=filters,
        )
        for connector in connectors
    ]
)

    # --------------------------------
    # Process store results
    # --------------------------------

    successful_results = [
        products
        for success, products in store_results
        if success
    ]

    stores_succeeded = sum(
        1
        for success, _ in store_results
        if success
    )

    stores_failed = sum(
        1
        for success, _ in store_results
        if not success
    )

    products = [
        product
        for store_products in successful_results
        for product in store_products
    ]


    # --------------------------------
    # Search
    # --------------------------------

    query_lower = query.lower().strip()

    query_words = [
        word
        for word in query_lower.split()
        if len(word) > 2
    ]

    results = []

    for product in products:

        searchable_text = " ".join(
            [
                product["title"],
                product["brand"],
                product["category"],
                product["store_name"],
            ]
        ).lower()

        # Text search
        if query_words and not all(
            word in searchable_text
            for word in query_words
        ):
            continue

        # --------------------------------
        # Filters
        # --------------------------------

        if filters:

            if (
                filters.brand
                and product["brand"].lower()
                != filters.brand.lower()
            ):
                continue

            if (
                filters.store_id
                and product["store_id"].lower()
                != filters.store_id.lower()
            ):
                continue

            if (
                filters.category
                and product["category"].lower()
                != filters.category.lower()
            ):
                continue

            if (
                filters.min_price is not None
                and product["price"] < filters.min_price
            ):
                continue

            if (
                filters.max_price is not None
                and product["price"] > filters.max_price
            ):
                continue

            if (
                filters.min_rating is not None
                and (
                    product["rating"] is None
                    or product["rating"] < filters.min_rating
                )
            ):
                continue

        results.append(product)

    # --------------------------------
    # Sorting
    # --------------------------------

    if sort_by == "price_low_to_high":

        results.sort(
            key=lambda product: product["price"]
        )

    elif sort_by == "price_high_to_low":

        results.sort(
            key=lambda product: product["price"],
            reverse=True,
        )

    elif sort_by == "rating":

        results.sort(
            key=lambda product: product["rating"] or 0,
            reverse=True,
        )

    elif sort_by == "relevance":

        results.sort(
            key=lambda product: calculate_relevance_score(
                product,
                query,
            ),
            reverse=True,
        )

    return {
        "products": results,
        "stores_searched": len(connectors),
        "stores_succeeded": stores_succeeded,
        "stores_failed": stores_failed,
    }