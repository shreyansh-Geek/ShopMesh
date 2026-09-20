from pydantic import BaseModel, Field


class SearchFilters(BaseModel):
    brand: str | None = None
    store_id: str | None = None
    category: str | None = None

    min_price: float | None = Field(default=None, ge=0)
    max_price: float | None = Field(default=None, ge=0)

    min_rating: float | None = Field(
        default=None,
        ge=0,
        le=5,
    )


class SearchRequest(BaseModel):
    query: str = Field(
        min_length=1,
        max_length=500,
    )

    filters: SearchFilters | None = None
    sort_by: str = "relevance"
    stores: list[str] | None = None


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

    stores_searched: int
    stores_succeeded: int
    stores_failed: int