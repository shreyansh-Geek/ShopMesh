# ShopMesh

> A multi-store product discovery and price comparison platform.

ShopMesh is a product search and comparison platform designed to help users discover products across multiple e-commerce stores through a single search experience.

Instead of searching individual marketplaces separately, ShopMesh aims to provide a unified interface where products from supported stores can be searched, filtered, sorted, and compared.

## Current Status

**Development Frozen**

The core search architecture and multi-store foundation have been implemented and validated using mock store data.

Development is currently paused at the **real-world product data acquisition stage**.

The primary challenge is identifying reliable, sustainable, and appropriately authorized product-data sources/APIs that can support ShopMesh at scale. Rather than building the production system around fragile or unverified data acquisition methods, development has been intentionally frozen until a suitable data source strategy is established.

This is a deliberate product and engineering decision.

## What Has Been Built

* React + Vite frontend
* FastAPI backend
* Product search API
* Canonical product data model
* Multi-store connector architecture
* Store-specific source abstraction
* Multi-store search
* Product filtering and sorting
* Pydantic validation and normalization
* Mock integrations for development
* API documentation through Swagger/OpenAPI

## Architecture

```text
User
  ↓
React Frontend
  ↓
FastAPI Search API
  ↓
Search Service
  ↓
Store Connectors
  ↓
Store Sources / APIs
  ↓
Product Normalization
  ↓
Unified Product Results
```

The architecture is intentionally designed so that individual store integrations can be added without coupling the core search system to a specific marketplace.

## Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS

**Backend**

* Python
* FastAPI
* Pydantic
* Uvicorn

## Roadmap

When development resumes:

1. Establish a reliable product-data acquisition strategy.
2. Integrate the first production store.
3. Validate the complete end-to-end pipeline.
4. Add additional stores through the existing connector architecture.
5. Introduce production concerns such as caching, rate limiting, retries, monitoring, and analytics.
6. Evaluate affiliate and other monetization models.

## Development Philosophy

ShopMesh is being developed incrementally, with a preference for stable and maintainable integrations over short-term workarounds.

The current pause preserves the existing architecture while allowing the project to resume when suitable data-access opportunities become available.

---

**Project:** ShopMesh
**Status:** Development Frozen
**Focus:** Multi-store product discovery & comparison
