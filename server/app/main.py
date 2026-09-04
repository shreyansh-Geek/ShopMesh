from fastapi import FastAPI

app = FastAPI(
    title="ShopMesh API",
    description="AI-powered universal shopping search API",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "shopmesh-api",
    }