from fastapi import APIRouter

from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_products


router = APIRouter(
    prefix="/api",
    tags=["search"],
)


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):

    search_result = await search_products(
    query=request.query,
    filters=request.filters,
    sort_by=request.sort_by,
)

    return SearchResponse(
    query=request.query,
    products=search_result["products"],
    total=len(search_result["products"]),
    stores_searched=search_result["stores_searched"],
    stores_succeeded=search_result["stores_succeeded"],
    stores_failed=search_result["stores_failed"],
)