from fastapi import APIRouter

from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_products


router = APIRouter(
    prefix="/api",
    tags=["search"],
)


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    products = search_products(request.query)

    return SearchResponse(
        query=request.query,
        products=products,
        total=len(products),
    )