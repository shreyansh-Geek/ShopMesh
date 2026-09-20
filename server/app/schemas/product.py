from pydantic import BaseModel


class Product(BaseModel):
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