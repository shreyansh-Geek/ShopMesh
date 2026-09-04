from app.services.product_repository import PRODUCTS


def search_products(query: str) -> list[dict]:
    query_lower = query.lower()

    results = []

    for product in PRODUCTS:
        searchable_text = " ".join(
            [
                product["title"],
                product["brand"],
                product["category"],
                product["store_name"],
            ]
        ).lower()

        if any(
            word in searchable_text
            for word in query_lower.split()
            if len(word) > 2
        ):
            results.append(product)

    return results