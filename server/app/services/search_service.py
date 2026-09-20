from app.schemas.search import SearchFilters
from app.services.product_repository import PRODUCTS


def search_products(
    query: str,
    filters: SearchFilters | None = None,
    sort_by: str = "relevance",
) -> list[dict]:

    query_lower = query.lower().strip()
    results = []

    query_words = [
        word
        for word in query_lower.split()
        if len(word) > 2
    ]

    for product in PRODUCTS:

        searchable_text = " ".join(
            [
                product["title"],
                product["brand"],
                product["category"],
                product["store_name"],
            ]
        ).lower()

        # -------------------------
        # Text search
        # -------------------------

        if query_words and not all(
            word in searchable_text
            for word in query_words
        ):
            continue

        # -------------------------
        # Filters
        # -------------------------

        if filters:

            if (
                filters.brand
                and product["brand"].lower() != filters.brand.lower()
            ):
                continue

            if (
                filters.store_id
                and product["store_id"].lower() != filters.store_id.lower()
            ):
                continue

            if (
                filters.category
                and product["category"].lower() != filters.category.lower()
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
                and product["rating"] < filters.min_rating
            ):
                continue

        results.append(product)

    # -------------------------
    # Sorting
    # -------------------------

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
            key=lambda product: product["rating"],
            reverse=True,
        )

    # Default:
    # relevance → preserve current search order
    elif sort_by == "relevance":
        pass

    return results