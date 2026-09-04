# ShopMesh — Implementation Plan

## 1. Product Definition & MVP Scope

**Product**: AI-powered universal shopping search and comparison platform
**Tagline**: "One search. Every store."
**MVP Target**: Phases 1-4 (Foundation + Product Domain + Fake Dataset + Flipkart Connector)

### MVP In-Scope
- React + Vite + Tailwind + shadcn/ui frontend
- FastAPI + SQLAlchemy + Alembic + PostgreSQL backend
- Monorepo structure
- Product domain model (Product, Offer, Store, Category, Variant, SearchIntent)
- Realistic fake product dataset (~500 products across categories)
- Product listing, cards, search, filters, sorting, product details
- Flipkart Affiliate API connector (search + product detail)
- Connector abstraction for extensibility
- Basic AI query understanding (LLM → structured intent)
- Deterministic filters (price, brand, category, rating, store)

### MVP Out-of-Scope
- Semantic search / embeddings / pgvector (Phase 9)
- Product matching/deduplication across stores (Phase 10)
- Advanced ranking with explainability (Phase 11)
- LangGraph agentic workflows (Phase 12)
- Conversational refinement
- Multiple real connectors (Phase 5+)
- Redis caching, Docker, AWS deployment
- User accounts, wishlists, price alerts

---

## 2. Architecture

### High-Level (Modular Monolith)
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  Pages: Home, Search, ProductDetail, Category, Store        │
│  Components: ProductCard, Filters, Sort, SearchBar          │
│  State: React Query (TanStack Query) for server state       │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API + WebSocket (future)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                       │
│  ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ │
│  │ API Routes  │ │ Core Logic  │ │ Connectors             │ │
│  │ /api/v1/    │ │ Services    │ │ ┌───────────────────┐  │ │
│  │ products    │ │ Search      │ │ │ StoreConnector    │  │ │
│  │ search      │ │ Normalizer  │ │ │ (interface)       │  │ │
│  │ stores      │ │ Matcher     │ │ └─────────┬─────────┘  │ │
│  │ categories  │ │ Ranker      │ │           │            │ │
│  └─────────────┘ └─────────────┘ │ ┌─────────▼─────────┐  │ │
│           │           │          │ │ FlipkartConnector │  │ │
│           ▼           ▼          │ └───────────────────┘  │ │
│  ┌─────────────────────────────┐ │                        │ │
│  │ Data Layer (SQLAlchemy)     │ │                        │ │
│  │ PostgreSQL + pgvector (later)│                        │ │
│  └─────────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions
1. **Modular monolith** — Single deployable unit, clear module boundaries
2. **Connector pattern** — Each source implements `StoreConnector` interface
3. **Normalization layer** — Source data → canonical schema (separate from connectors)
4. **Async throughout** — `asyncio` for parallel connector searches
5. **Fault isolation** — One failing connector doesn't break search
6. **LLM separation** — AI only for query understanding; deterministic logic for filters/sort

---

## 3. Repository Structure (Monorepo)

```
shopmesh/
├── .github/
│   └── workflows/           # CI/CD (later)
├── docker/                  # Docker configs (later)
├── docs/                    # Architecture docs, ADRs
├── frontend/                # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── components/      # Shared UI components (shadcn/ui based)
│   │   │   ├── ui/          # Button, Input, Card, etc.
│   │   │   ├── product/     # ProductCard, ProductGrid, ProductSkeleton
│   │   │   ├── search/      # SearchBar, Filters, SortDropdown
│   │   │   └── layout/      # Header, Footer, Sidebar
│   │   ├── pages/           # Route components
│   │   │   ├── Home.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Category.jsx
│   │   │   └── Store.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, API client, constants
│   │   ├── services/        # API service layer
│   │   ├── types/           # JSDoc types / shared interfaces
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # Tailwind imports
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── jsconfig.json
├── backend/                 # FastAPI app
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── routes/
│   │   │   │   │   ├── products.py
│   │   │   │   │   ├── search.py
│   │   │   │   │   ├── stores.py
│   │   │   │   │   └── categories.py
│   │   │   │   └── router.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py         # Settings (Pydantic BaseSettings)
│   │   │   ├── database.py       # SQLAlchemy engine, session
│   │   │   ├── exceptions.py     # Custom exceptions
│   │   │   └── logging.py
│   │   ├── models/               # SQLAlchemy models
│   │   │   ├── product.py
│   │   │   ├── offer.py
│   │   │   ├── store.py
│   │   │   ├── category.py
│   │   │   ├── variant.py
│   │   │   └── search_intent.py
│   │   ├── schemas/              # Pydantic schemas (request/response)
│   │   │   ├── product.py
│   │   │   ├── offer.py
│   │   │   ├── store.py
│   │   │   ├── search.py
│   │   │   └── common.py
│   │   ├── services/             # Business logic
│   │   │   ├── search_service.py
│   │   │   ├── product_service.py
│   │   │   ├── normalization.py
│   │   │   └── ai/
│   │   │       └── query_understanding.py
│   │   ├── connectors/           # Source connectors
│   │   │   ├── base.py           # StoreConnector abstract base
│   │   │   ├── flipkart/
│   │   │   │   ├── client.py     # Flipkart API client
│   │   │   │   ├── connector.py  # Implements StoreConnector
│   │   │   │   ├── mapper.py     # Flipkart → canonical schema
│   │   │   │   └── config.py
│   │   │   └── registry.py       # Connector registry
│   │   ├── tasks/                # Background tasks (later)
│   │   └── main.py               # FastAPI app factory
│   ├── alembic/                  # Migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pyproject.toml
│   ├── .env.example
│   └── Dockerfile (later)
├── shared/                     # Shared types/constants (optional)
├── scripts/                    # Dev scripts (seed, migrate, etc.)
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml (later)
└── Makefile                    # Common commands
```

---

## 4. Technology Stack (Confirmed)

| Layer | Technology | Version Target |
|-------|------------|----------------|
| Frontend Framework | React | 18.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| Routing | React Router | 6.x |
| State/Server | TanStack Query | 5.x |
| Backend Framework | FastAPI | 0.110+ |
| ORM | SQLAlchemy | 2.0 (async) |
| Migrations | Alembic | 1.13+ |
| Validation | Pydantic | 2.x |
| Database | PostgreSQL | 16+ |
| Vector Search | pgvector | 0.7+ (Phase 9) |
| AI/LLM | OpenAI API / Anthropic | Latest |
| Structured Output | Instructor / Pydantic | Latest |
| HTTP Client | httpx (async) | 0.27+ |
| Testing | pytest, pytest-asyncio | Latest |

---

## 5. Data Model (Canonical Schema)

### Core Entities

```python
# Product - Canonical product (e.g., "iPhone 15 Pro 128GB Natural Titanium")
Product:
  - id (UUID, PK)
  - gtin/upc/ean (String, nullable, unique)  # Global identifier
  - brand (String, indexed)
  - canonical_title (String)
  - normalized_title (String, search-optimized)
  - description (Text)
  - category_id (FK → Category)
  - subcategory_id (FK → Category, nullable)
  - attributes (JSONB)  # Flexible: {"color": "Natural Titanium", "storage": "128GB", ...}
  - specifications (JSONB)  # Structured specs: {"display": "6.1\"", "chip": "A17 Pro", ...}
  - images (JSONB)  # [{"url": "...", "alt": "...", "is_primary": true}, ...]
  - embedding (Vector, pgvector, Phase 9)
  - created_at, updated_at

# Offer - Retailer-specific listing (e.g., "Amazon: iPhone 15 Pro 128GB @ ₹1,34,900")
Offer:
  - id (UUID, PK)
  - product_id (FK → Product)
  - store_id (FK → Store)
  - store_product_id (String)  # Retailer's SKU/ASIN
  - store_url (String)  # Deep link to product page
  - price_amount (Integer, paise/cents)  # Current price
  - price_currency (String, default "INR")
  - original_price_amount (Integer, nullable)  # MRP/Strikethrough
  - availability (Enum: IN_STOCK, OUT_OF_STOCK, LIMITED, PRE_ORDER)
  - delivery_info (JSONB)  # {"eta_days": 2, "free_delivery": true, ...}
  - rating (Numeric, nullable)  # Store-specific rating
  - review_count (Integer, default 0)
  - seller_name (String, nullable)  # For marketplace
  - seller_rating (Numeric, nullable)
  - is_primary_offer (Boolean)  # Best offer for this product
  - last_synced_at (DateTime)
  - created_at, updated_at

# Store/Retailer
Store:
  - id (UUID, PK)
  - code (String, unique)  # "flipkart", "amazon", "myntra"
  - name (String)
  - logo_url (String)
  - website_url (String)
  - affiliate_base_url (String, nullable)
  - api_config (JSONB, encrypted)  # API keys, endpoints
  - is_active (Boolean)
  - rate_limit_rps (Integer)
  - created_at, updated_at

# Category (Hierarchical)
Category:
  - id (UUID, PK)
  - parent_id (FK → Category, nullable)
  - code (String, unique)  # "electronics", "electronics.smartphones"
  - name (String)
  - slug (String, unique)
  - icon (String, nullable)
  - display_order (Integer)
  - is_active (Boolean)
  - attributes_schema (JSONB)  # Expected attributes for this category

# Product Variant (Size/Color combinations for same product)
Variant:
  - id (UUID, PK)
  - product_id (FK → Product)
  - attributes (JSONB)  # {"size": "M", "color": "Black"}
  - gtin (String, nullable)
  - offers (Relationship → Offer)

# Search Intent (Structured from LLM)
SearchIntent:
  - id (UUID, PK)
  - raw_query (Text)
  - parsed_intent (JSONB)  # Structured output from LLM
  - category_id (FK → Category, nullable)
  - max_price (Integer, nullable)
  - min_price (Integer, nullable)
  - brands (String[], nullable)
  - attributes (JSONB)  # {"color": "black", "size": "M"}
  - use_cases (String[])  # ["running", "gym"]
  - preferences (JSONB)  # {"lightweight": true, "battery_life": "high"}
  - created_at
```

### Key Design Principles
- **Product ≠ Offer** — One canonical product, many retailer offers
- **JSONB for flexibility** — Category-specific attributes without schema changes
- **GTIN as primary deduplication key** — When available
- **Price in minor units (paise)** — Avoid floating point errors
- **Time-sensitive pricing** — `last_synced_at` for freshness

---

## 6. Development Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Initialize monorepo with Git
- [ ] Set up frontend: Vite + React + Tailwind + shadcn/ui
- [ ] Set up backend: FastAPI + SQLAlchemy + Alembic + PostgreSQL
- [ ] Configure environment variables (.env.example)
- [ ] Basic health check endpoints
- [ ] Frontend ↔ Backend communication (CORS, API client)
- [ ] Basic project documentation (README, CLAUDE.md)

### Phase 2: Product Domain (Week 2-3)
- [ ] Define SQLAlchemy models (Product, Offer, Store, Category, Variant)
- [ ] Create Alembic migrations
- [ ] Build Pydantic schemas (request/response)
- [ ] Implement CRUD services for core entities
- [ ] Seed database with categories hierarchy
- [ ] Basic admin API for store management

### Phase 3: Fake Dataset & Core UI (Week 3-4)
- [ ] Generate realistic fake dataset (~500 products, 10 categories, 5 stores)
- [ ] Build product listing page with grid view
- [ ] Product card component (image, title, price, rating, store badges)
- [ ] Product detail page (gallery, specs, offers table)
- [ ] Search page with:
  - [ ] Search bar (debounced)
  - [ ] Sidebar filters (price range, brand, category, store, rating, availability)
  - [ ] Sort dropdown (price, rating, relevance, newest)
  - [ ] Pagination / infinite scroll
  - [ ] URL-based state (shareable links)
- [ ] Category browse page
- [ ] Store page (all products from a store)
- [ ] Responsive design (mobile-first)

### Phase 4: Flipkart Connector (Week 4-5)
- [ ] Research Flipkart Affiliate API (endpoints, auth, rate limits)
- [ ] Implement `StoreConnector` abstract base class
- [ ] Build Flipkart HTTP client with:
  - [ ] Authentication (affiliate ID + token)
  - [ ] Rate limiting (token bucket)
  - [ ] Retry logic with exponential backoff
  - [ ] Error handling & logging
- [ ] Implement `search(query, filters)` method
- [ ] Implement `get_product(store_product_id)` method
- [ ] Build Flipkart → canonical schema mapper
- [ ] Register connector in registry
- [ ] Add Flipkart store to database
- [ ] Integration test: search → normalize → store → display
- [ ] Handle API limits gracefully (fallback to cached/fake data)

---

## 7. Local Development Environment

### Prerequisites
- Node.js 20+ (LTS)
- Python 3.11+
- PostgreSQL 16+ (local or Docker)
- Git

### Setup Commands
```bash
# 1. Clone & setup
git clone <repo>
cd shopmesh

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env  # Edit with local values
alembic upgrade head
python scripts/seed.py  # Categories + fake data

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# 4. Run backend (new terminal)
cd backend
uvicorn app.main:app --reload --port 8000

# 5. Access
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Environment Variables (`.env.example`)
```bash
# Backend
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/shopmesh
SECRET_KEY=your-secret-key
DEBUG=true

# Flipkart Affiliate API
FLIPKART_AFFILIATE_ID=your-affiliate-id
FLIPKART_AFFILIATE_TOKEN=your-token
FLIPKART_API_BASE_URL=https://affiliate-api.flipkart.net/affiliate

# LLM (Phase 8)
OPENAI_API_KEY=sk-...
# or ANTHROPIC_API_KEY=sk-ant-...

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 8. Key Implementation Notes

### Connector Interface
```python
# backend/app/connectors/base.py
from abc import ABC, abstractmethod
from typing import Optional
from app.schemas.search import SearchFilters, SearchResult
from app.schemas.product import ProductCreate, OfferCreate

class StoreConnector(ABC):
    store_code: str
    
    @abstractmethod
    async def search(self, query: str, filters: SearchFilters, limit: int = 20) -> SearchResult:
        pass
    
    @abstractmethod
    async def get_product(self, store_product_id: str) -> Optional[tuple[ProductCreate, list[OfferCreate]]]:
        pass
    
    async def health_check(self) -> bool:
        pass
```

### Normalization Pipeline
```
Raw Source Data → Mapper (source-specific) → Canonical Schema → Validator → DB
```

### Search Flow (MVP)
```
User Query → (Optional: LLM → SearchIntent) → SearchService
    → Build SQLAlchemy query with filters
    → Execute against local DB (fake data + any synced real data)
    → Return paginated results
    → Frontend renders ProductGrid
```

### Error Handling Strategy
- Connector failures: Log, return partial results, show "X store unavailable" badge
- Validation errors: Reject at schema level, never persist invalid data
- Rate limits: Respect `Retry-After`, queue requests, degrade gracefully

---

## 9. Next Steps

1. **Confirm this plan** — Any adjustments to scope, structure, or priorities?
2. **Initialize repository** — Create directory structure, base configs
3. **Begin Phase 1** — Frontend + Backend scaffolding

---

## 10. Open Questions for Later Phases

- [ ] pgvector integration strategy (Phase 9)
- [ ] Product matching algorithm design (Phase 10)
- [ ] Ranking formula & explainability (Phase 11)
- [ ] LangGraph workflow necessity (Phase 12)
- [ ] Caching strategy (Redis vs in-memory)
- [ ] Background sync jobs for price/availability updates
- [ ] Affiliate link tracking & analytics
- [ ] Multi-language / multi-currency support