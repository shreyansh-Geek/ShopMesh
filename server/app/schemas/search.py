from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)


class SearchProduct(BaseModel):
    id: str
    title: str
    brand: str
    category: str

    store_id: str
    store_name: str

    price: float
    mrp: float | None = None
    currency: str = "INR"

    rating: float | None = None
    rating_count: int | None = None

    image: str | None = None
    url: str

    availability: str = "unknown"


class SearchResponse(BaseModel):
    query: str
    products: list[SearchProduct]
    total: int