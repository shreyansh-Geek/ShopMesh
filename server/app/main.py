from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.search import router as search_router


app = FastAPI(
    title="ShopMesh API",
    description="AI-powered universal shopping search API",
    version="0.1.0",
)


app.include_router(health_router)
app.include_router(search_router)