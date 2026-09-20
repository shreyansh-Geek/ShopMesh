# ShopMesh — Project Status

> **Status: PAUSED**
>
> ShopMesh development is intentionally paused at the **real-world store data acquisition and integration** stage.
>
> The core application architecture, backend search pipeline, store connector abstraction, canonical product model, mock data sources, filtering, sorting, and frontend/backend integration are established for development.
>
> The primary unresolved challenge is obtaining **legitimate, reliable, sustainable, and programmatically accessible product data** from supported stores.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Current Status](#current-status)
- [Product Vision](#product-vision)
- [Current Architecture](#current-architecture)
- [Canonical Product Model](#canonical-product-model)
- [Implemented Components](#implemented-components)
- [Current End-to-End Flow](#current-end-to-end-flow)
- [Store Connector Architecture](#store-connector-architecture)
- [Store Source Architecture](#store-source-architecture)
- [Mock Product Repository](#mock-product-repository)
- [Search Service](#search-service)
- [API](#api)
- [Store Integration Status](#store-integration-status)
- [Why Development Is Paused](#why-development-is-paused)
- [Architectural Decisions](#architectural-decisions)
- [Data Acquisition Requirements](#data-acquisition-requirements)
- [Planned Resume Strategy](#planned-resume-strategy)
- [What Not to Do Yet](#what-not-to-do-yet)
- [Resume Checklist](#resume-checklist)
- [Last Known Good State](#last-known-good-state)
- [Development Principles](#development-principles)

---

## Project Overview

**ShopMesh** is intended to be a multi-store product discovery and comparison platform.

The core idea is:

> A user searches for a product once, and ShopMesh searches supported stores and presents normalized product results through a single interface.

Example:

```text
Nike running shoes
```

The long-term system should return comparable products from multiple stores with:

- Product title
- Brand
- Category
- Store
- Current price
- MRP / list price
- Discount
- Rating
- Rating count
- Product image
- Availability
- Product URL
- Affiliate/deep link where available

The long-term objective is to make product discovery and price comparison easier across multiple Indian e-commerce stores.

---

## Current Status

### Development Status

**PAUSED**

Development has been deliberately paused rather than abandoned.

The application architecture has reached a stage where further core engineering can continue independently from the unresolved data-acquisition problem.

The current blocker is:

```text
LEGITIMATE + RELIABLE + PROGRAMMATIC PRODUCT DATA ACQUISITION
```

The mock product pipeline works.

The remaining challenge is establishing a sustainable way to obtain real product data from external stores.

### What Is Already Working

- React frontend
- Vite frontend setup
- Tailwind CSS
- React Router
- FastAPI backend
- Uvicorn development server
- Pydantic models
- Search API
- Search request/response schemas
- Canonical `Product` model
- Store connector abstraction
- Store registry
- Store-specific mock connectors
- Store-specific mock sources
- Mock product repository
- Multi-store search
- Query normalization
- Text-based product matching
- Filtering
- Sorting
- Relevance scoring
- Pydantic product validation
- Store success/failure tracking
- Frontend/backend communication
- Development CORS configuration

---

## Product Vision

The intended architecture is:

```text
User Search
     |
     v
ShopMesh Search API
     |
     v
Multiple Store Connectors
     |
     v
Store Data Sources
     |
     v
Raw Product Data
     |
     v
Canonical Product Model
     |
     v
Search / Filtering / Sorting
     |
     v
Normalized API Response
     |
     v
React Frontend
```

Example:

```text
"Nike running shoes"
        |
        v
   ShopMesh API
        |
   +----+----+----+
   |         |    |
 Amazon    Myntra Flipkart
   |         |    |
 Source    Source Source
   |         |    |
   +----+----+----+
        |
        v
Product Normalization
        |
        v
Filtering / Sorting
        |
        v
Search Response
        |
        v
Frontend Results
```

---

## Current Architecture

### Frontend

```text
React
Vite
Tailwind CSS
React Router
```

### Backend

```text
Python
FastAPI
Pydantic
Uvicorn
```

### Python Project Management

The backend uses `uv` for Python project and dependency management.

Development command:

```bash
uv run uvicorn app.main:app --reload
```

### Backend Architecture

```text
                    API Route
                        |
                        v
                 Search Service
                        |
                        v
                 Store Registry
                        |
                        v
                Store Connectors
                        |
                        v
                  Store Sources
                        |
                        v
                Raw Product Data
                        |
                        v
              Product Normalization
                        |
                        v
               Canonical Product
                        |
                        v
           Search / Filter / Sorting
                        |
                        v
                  API Response
```

The search engine should remain independent of the internal structure of individual stores.

---

## Canonical Product Model

ShopMesh uses a canonical `Product` model so that products from different sources have a consistent representation.

Current fields include:

```text
id
title
brand
category
store_id
store_name
price
mrp
currency
rating
rating_count
image
url
availability
```

Example:

```json
{
  "id": "shopmesh-1",
  "title": "Nike Revolution 7 Running Shoes",
  "brand": "Nike",
  "category": "Running Shoes",
  "store_id": "myntra",
  "store_name": "Myntra",
  "price": 4299,
  "mrp": 5999,
  "currency": "INR",
  "rating": 4.4,
  "rating_count": 1240,
  "image": "https://example.com/image.jpg",
  "url": "https://example.com/product",
  "availability": "in_stock"
}
```

All future store integrations should normalize external product data into this model.

---

## Implemented Components

### FastAPI Application

The backend is implemented using FastAPI and runs through Uvicorn.

```bash
uv run uvicorn app.main:app --reload
```

FastAPI documentation is available during development at:

```text
/docs
```

### Search API

Current endpoint:

```text
POST /api/search
```

The endpoint accepts search information and store selection and returns normalized products.

### Search Schemas

Pydantic schemas have been established for search requests and responses.

The search layer supports:

- Search query
- Store selection
- Brand filtering
- Category filtering
- Minimum price
- Maximum price
- Minimum rating
- Sorting

### Search Service

Implemented functionality includes:

- Query normalization
- Query word extraction
- Multi-store search
- Concurrent store requests
- Store success tracking
- Store failure tracking
- Product collection
- Product flattening
- Text search
- Brand filtering
- Store filtering
- Category filtering
- Price filtering
- Rating filtering
- Price sorting
- Rating sorting
- Relevance sorting
- Relevance scoring

The search service operates on canonical `Product` objects rather than individual store-specific structures.

### Pydantic Validation

Raw product dictionaries are converted into the canonical Pydantic model using validation such as:

```python
Product.model_validate(...)
```

This provides a consistent product representation before products enter the search pipeline.

---

## Current End-to-End Flow

```text
React Frontend
       |
       v
FastAPI
       |
       v
POST /api/search
       |
       v
Search Service
       |
       v
Store Registry
       |
       +-------------------+
       |                   |
       v                   v
Mock Amazon          Mock Myntra
       |                   |
       v                   v
Mock Source          Mock Source
       |                   |
       +---------+---------+
                 |
                 v
          Product Objects
                 |
                 v
       Filtering / Sorting
                 |
                 v
          Search Response
                 |
                 v
          React Frontend
```

This flow should remain valid after real store sources are introduced.

Only the data source should change; the core search architecture should not need to be rewritten.

---

## Store Connector Architecture

A common connector abstraction has been created:

```text
StoreConnector
```

The connector exposes a consistent interface to the search service.

Conceptually:

```text
store_id
store_name
search()
```

Example:

```python
class StoreConnector:
    @property
    def store_id(self) -> str:
        ...

    @property
    def store_name(self) -> str:
        ...

    async def search(
        self,
        query: str,
        filters=None,
    ):
        ...
```

The important architectural rule is:

> The search service communicates with stores through the common connector interface.

---

## Store Source Architecture

A separate source layer was introduced to keep:

```text
DATA ACQUISITION
```

separate from:

```text
STORE CONNECTOR / NORMALIZATION
```

Conceptually:

```text
StoreConnector
      |
      v
StoreSource
      |
      v
Raw External Data
      |
      v
Product Normalization
      |
      v
Canonical Product
```

Acquisition and normalization are separate responsibilities.

A future real source should be replaceable without forcing changes throughout the search engine.

---

## Mock Product Repository

A local mock product repository was created for development.

It contains representative product data for stores such as:

- Amazon
- Myntra
- Flipkart

The mock repository exists specifically to unblock application development while real store acquisition remains unresolved.

### Important

The mock repository is:

```text
DEVELOPMENT DATA
```

It is **not** the production product-data acquisition mechanism.

The mock data allows the following to be developed independently:

- Search
- Filtering
- Sorting
- UI
- API contracts
- Store abstractions
- Product normalization
- Error handling
- Multi-store orchestration

---

## Search Service

### Store Selection

The system can search all registered stores or selected stores.

```text
Search Request
      |
      v
Selected Stores?
   /          Yes          No
 |             |
 v             v
Selected     All Registered
Connectors   Connectors
```

### Concurrent Store Search

Store searches are executed concurrently:

```text
                Search
                  |
       +----------+----------+
       |          |          |
       v          v          v
    Amazon     Myntra     Flipkart
       |          |          |
       +----------+----------+
                  |
                  v
          Combined Results
```

### Failure Isolation

The search service tracks:

```text
stores_searched
stores_succeeded
stores_failed
```

A failure in one connector does not necessarily prevent successful results from other connectors from being returned.

### Filtering

Current filters:

```text
Brand
Store
Category
Minimum Price
Maximum Price
Minimum Rating
```

### Sorting

Current sorting options:

```text
price_low_to_high
price_high_to_low
rating
relevance
```

### Relevance

The current development relevance scoring considers:

```text
Title
Brand
Category
Store
```

Exact title matches receive additional score, while query-word matches contribute additional score based on where the word appears.

This is intentionally a lightweight development search mechanism rather than a production-grade semantic search system.

---

## API

### Search

```http
POST /api/search
```

The API is designed to return normalized products rather than expose store-specific response structures.

### Documentation

During local development:

```text
http://127.0.0.1:8000/docs
```

### Backend

```bash
uv run uvicorn app.main:app --reload
```

The exact health endpoint should be verified against the current backend implementation when development resumes.

---

## Store Integration Status

### Amazon

**Current state**

A mock Amazon connector/source exists.

Real Amazon product integration has **not** been completed.

Amazon's current product API ecosystem includes the Creators API.

Before implementing a production integration, verify the current:

- Eligibility
- Account requirements
- API access
- Product-search capabilities
- Request limits
- Commercial/usage terms
- Data usage restrictions
- Link requirements

Do not assume API availability or eligibility is unchanged over time.

### Flipkart

**Current state**

A mock Flipkart connector/source exists.

Real Flipkart product acquisition has **not** been completed.

The official Flipkart Affiliate API was investigated, but obtaining usable affiliate/API access was not straightforward during development.

The Flipkart Seller API was also investigated.

The Seller API should not automatically be substituted for the product-discovery use case without re-evaluating the architecture.

### Myntra

**Current state**

A mock Myntra connector/source exists.

No verified public product-search API suitable for the intended ShopMesh use case was established during this development phase.

Real integration therefore remains unresolved.

---

## Why Development Is Paused

The primary unresolved problem is:

```text
LEGITIMATE
+
RELIABLE
+
PROGRAMMATIC
+
SUSTAINABLE
PRODUCT DATA ACQUISITION
```

The engineering problem is no longer primarily:

```text
"Can we build the search application?"
```

The current problem is:

```text
"Can ShopMesh obtain real product data from external stores
in a reliable and permitted way?"
```

This must be resolved before implementing the production acquisition layer.

### Why This Matters

A production data source needs to be:

- Accessible
- Stable
- Relevant to the use case
- Permitted for the intended use
- Sustainable at expected request volume
- Compatible with required product fields
- Suitable for long-term maintenance

A technically possible acquisition method is not automatically a suitable production architecture.

---

## Architectural Decisions

### 1. Keep Data Acquisition Separate

```text
DATA ACQUISITION
        |
        v
RAW STORE DATA
        |
        v
NORMALIZATION
        |
        v
CANONICAL PRODUCT
```

The search engine should not know how an individual store's data was obtained.

### 2. Keep Store Connectors

The `StoreConnector` abstraction should remain.

It provides a stable interface between:

```text
Search Service
```

and:

```text
Individual Stores
```

### 3. Keep Mock Sources

Mock sources should remain available for:

- Search development
- Frontend development
- API contracts
- Filters
- Sorting
- Failure handling
- Loading states
- Empty states

### 4. Separate Acquisition From Monetization

Product acquisition and affiliate monetization should remain separate.

Product acquisition:

```text
Store API / Approved Data Provider
              |
              v
        Raw Product Data
              |
              v
         Normalization
              |
              v
       Canonical Product
```

Monetization:

```text
User Product Click
        |
        v
Affiliate / Deep Link
        |
        v
Merchant
```

Do not make the entire product-data pipeline dependent on a single affiliate provider.

---

## Data Acquisition Requirements

Before implementing a real store source, evaluate whether it can provide the required information.

### Minimum Desired Product Data

```text
Product ID
Product title
Brand
Category
Current price
MRP / list price
Currency
Product image
Product URL
Availability
```

### Useful Additional Data

```text
Rating
Rating count
Discount
Seller
Variants
Color
Size
```

### Source Requirements

A production source should ideally provide:

- Keyword/product search
- Stable product identifiers
- Product details
- Current pricing
- Product images
- Product URLs
- Availability
- Sustainable API access
- Appropriate usage rights/terms
- Reasonable rate limits
- Reliable uptime
- Documentation
- Authentication
- Useful error information

---

## Planned Resume Strategy

### Step 1 — Re-evaluate Real Data Sources

Investigate currently available legitimate sources.

Potential sources to investigate include:

```text
Amazon Creators API
Flipkart Affiliate API
Approved affiliate/data networks
Other legitimate Indian e-commerce APIs/providers
```

Availability, eligibility, terms, and capabilities must be re-verified when development resumes.

### Step 2 — Choose One Real Source

Integrate **one** real store/source first.

Do not integrate multiple stores simultaneously.

First prove:

```text
Real API
    |
    v
Source
    |
    v
Connector
    |
    v
Product Normalization
    |
    v
Canonical Product
    |
    v
Search Service
    |
    v
Search API
    |
    v
Frontend
```

### Step 3 — Production Hardening

After the first real source works, add:

- Caching
- Timeout handling
- Retry handling
- Rate-limit handling
- API failure isolation
- Structured logging
- Monitoring
- Metrics
- Response validation
- Source-specific error handling
- Configuration management
- Secrets management

### Step 4 — Add Additional Stores

Each additional store should implement the existing architecture:

```text
Store
  ↓
Source
  ↓
Raw Data
  ↓
Connector
  ↓
Product
```

The core search engine should remain store-agnostic.

---

## What Not to Do Yet

Until a legitimate and sustainable real data source is confirmed, do **not**:

- Build production scraping around unverified assumptions
- Add proxy rotation
- Add CAPTCHA bypass mechanisms
- Build anti-bot evasion
- Tightly couple ShopMesh to one affiliate provider
- Rewrite the search architecture
- Delete the existing mock sources
- Remove the `StoreConnector` abstraction
- Replace the canonical `Product` model with store-specific models
- Integrate multiple uncertain data sources simultaneously

The objective is to solve the data-acquisition problem without compromising the architecture that is already working.

---

## Resume Checklist

### Environment

- [ ] Read `PROJECT_STATUS.md`
- [ ] Review the current repository structure
- [ ] Confirm Python / `uv` environment
- [ ] Install/update dependencies if required

### Backend

- [ ] Start FastAPI
- [ ] Verify `/docs`
- [ ] Verify health endpoint
- [ ] Test `POST /api/search`

### Frontend

- [ ] Start React/Vite application
- [ ] Verify frontend/backend communication
- [ ] Confirm mock product search works

### Data Acquisition

- [ ] Review currently available store APIs
- [ ] Verify current API eligibility
- [ ] Verify current API terms
- [ ] Verify required product fields
- [ ] Select one legitimate source
- [ ] Implement the corresponding `StoreSource`
- [ ] Connect it to the existing connector
- [ ] Normalize data into `Product`
- [ ] Test the real source independently

### Integration

- [ ] Test the real source through `/api/search`
- [ ] Test frontend results
- [ ] Test filtering
- [ ] Test sorting
- [ ] Test store failure handling
- [ ] Add caching/timeouts/retries where appropriate
- [ ] Add logging and monitoring
- [ ] Commit the completed integration

### Expansion

- [ ] Only after the first source is stable, evaluate the next store
- [ ] Reuse the existing connector/source architecture
- [ ] Avoid modifying the search engine for store-specific behavior

---

## Last Known Good State

The project was intentionally paused after establishing:

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Frontend/backend communication

### Backend

- Python
- FastAPI
- Uvicorn
- `uv` project/dependency management
- API routing
- Search API
- API documentation

### Data Model

- Canonical `Product` model
- Pydantic validation
- Search request schema
- Search response schema

### Search Architecture

- Search service
- Multi-store search
- Concurrent store requests
- Store success/failure tracking
- Query normalization
- Text matching
- Filtering
- Sorting
- Relevance scoring

### Store Architecture

- `StoreConnector`
- Store registry
- Store-specific connectors
- Store-specific mock sources
- Mock Amazon source
- Mock Myntra source
- Mock Flipkart source

### Development Data

- Mock product repository
- Multiple products across supported mock stores

---

## Development Principles

### Principle 1 — Source-Agnostic Search

The search engine should not care where a product came from.

```text
Amazon
Myntra
Flipkart
Future Store
     |
     v
Canonical Product
     |
     v
Search Engine
```

### Principle 2 — Normalize at the Boundary

Store-specific data should be converted into the canonical `Product` model at the source boundary.

```text
External Format
      |
      v
Normalization
      |
      v
Product
```

The rest of the application should operate on the canonical model.

### Principle 3 — Isolate Store Failures

A single unavailable store should not unnecessarily bring down the complete search experience.

```text
Amazon     → Success
Myntra     → Failure
Flipkart   → Success

                ↓

      Return successful products
      + store failure information
```

### Principle 4 — Mock Data Is a Development Asset

Mock data is intentionally useful for developing the application independently from external data providers.

### Principle 5 — Verify Before Integrating

Before building a real store integration, verify:

```text
API availability
        +
Eligibility
        +
Terms
        +
Required fields
        +
Rate limits
        +
Long-term viability
```

### Principle 6 — One Real Source at a Time

The first real integration should prove the architecture before the project scales to additional stores.

---

## Project Resume Point

> **The next meaningful engineering task is not rebuilding ShopMesh.**
>
> The next task is to identify and validate a legitimate real-world product data source that satisfies ShopMesh's requirements.
>
> Once one suitable source is confirmed, implement it behind the existing `StoreSource` / `StoreConnector` abstraction and normalize its results into the existing canonical `Product` model.
>
> The existing mock pipeline should remain available until the real acquisition layer is proven stable.

---

## Status Summary

| Area | Status |
|---|---|
| Product vision | Defined |
| Frontend architecture | Implemented |
| Backend architecture | Implemented |
| FastAPI application | Implemented |
| Search API | Implemented |
| Canonical Product model | Implemented |
| Pydantic validation | Implemented |
| StoreConnector abstraction | Implemented |
| Store registry | Implemented |
| Mock store sources | Implemented |
| Mock product catalogue | Implemented |
| Multi-store search | Implemented |
| Filtering | Implemented |
| Sorting | Implemented |
| Relevance search | Implemented |
| Frontend/backend flow | Implemented |
| Real Amazon integration | Pending |
| Real Flipkart integration | Pending |
| Real Myntra integration | Pending |
| Production data acquisition strategy | **BLOCKED / UNRESOLVED** |
| Development status | **PAUSED** |

---

**ShopMesh is paused at the data-acquisition boundary, not at the core application architecture.**
