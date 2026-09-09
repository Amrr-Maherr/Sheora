# Sheora Store

E-commerce storefront frontend built with **Next.js (App Router)**, **TypeScript**, **TanStack React Query**, and **shadcn/ui**-ready styling.

> This repo currently contains the **project architecture, routing, data layer, feature structure, and reusable patterns only**.
> No real UI has been built yet. Every page renders a simple placeholder indicating its purpose.

---

## Technology Stack

| Concern | Library |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict, `type` over `interface`) |
| Server state | TanStack React Query v5 |
| HTTP client | axios |
| Temporary backend | json-server |
| Styling | Tailwind CSS v4 |
| UI primitives (future) | shadcn/ui (all primitives, via CLI) |
| Utility CSS helpers | clsx + tailwind-merge |

---

## Folder Structure

```text
src/
├── app/                      # App Router: pages, layouts, providers, 404
│   ├── providers/            # Global providers (TanStack Query)
│   └── routes/...            # File-system routes (see Routing Structure)
├── components/
│   ├── ui/                   # shadcn/ui primitives (added when UI work starts)
│   └── shared/               # Genuinely shared components only
├── features/
│   ├── products/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/       # Containers + Presenters
│   │   └── index.ts
│   ├── categories/
│   ├── brands/
│   ├── search/
│   ├── cart/
│   ├── wishlist/
│   ├── orders/
│   ├── reviews/
│   └── auth | checkout | profile   # route-only placeholders for now
├── services/
│   └── api/                  # Centralized API client
├── hooks/                    # Global hooks (only if truly shared)
├── lib/                      # Utilities (cn helper for shadcn/ui)
├── types/                    # Shared domain types
├── constants/                # API config, query keys, demo user
└── routes/                   # Not used — App Router file-system routing replaces this
```

> **Note:** Routing lives in `src/app/` (file-system based). In App Router the `features/*/pages` and `src/routes` folders
> from the original plan are intentionally **not** created — pages belong to the App Router, not feature folders.
> Feature pages are thin and only compose feature containers.

---

## Routing Structure

### Public routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/products` | Products listing |
| `/products/:id` | Product details |
| `/categories` | Categories listing |
| `/categories/:slug` | Products filtered by category |
| `/brands` | Brands listing |
| `/brands/:slug` | Products filtered by brand |
| `/search` | Search results (`?q=`) |
| `/cart` | Shopping cart |
| `/wishlist` | Wishlist |

### Authentication routes (placeholders)

| Route | Page |
| --- | --- |
| `/login` | Login placeholder |
| `/register` | Register placeholder |
| `/forgot-password` | Forgot password placeholder |
| `/reset-password` | Reset password placeholder |

### Customer account routes (placeholders)

| Route | Page |
| --- | --- |
| `/account` | Account overview |
| `/account/profile` | Profile settings |
| `/account/orders` | Order history |
| `/account/orders/:id` | Order details |
| `/account/addresses` | Address book |
| `/account/wishlist` | Wishlist |

### Checkout routes (placeholders, no payment logic)

| Route | Page |
| --- | --- |
| `/checkout` | Checkout overview |
| `/checkout/shipping` | Shipping step |
| `/checkout/payment` | Payment step (not connected) |
| `/checkout/review` | Review step |
| `/checkout/success` | Order success |

### Error / system routes

| Route | Page |
| --- | --- |
| `/404` | Explicit 404 page |
| `*` | Fallback via `src/app/not-found.tsx` |

Loading / error / empty states are handled inside feature containers using React Query's state model.

---

## Feature Structure

Each feature owns its API functions, hooks, components, and types:

```text
features/products/
├── api/                 # productsApi: getProducts, getProductById, ...
├── hooks/               # useProducts, useProduct, useProductsByCategory, ...
├── components/          # Container + Presenter pairs
│   ├── ProductListContainer.tsx
│   └── ProductListPresenter.tsx
└── index.ts             # public barrel export
```

---

## JSON Server

A temporary backend lives at `db.json` (project root) with relational mock data:

```text
users, products, categories, brands, orders, cart, wishlist, reviews, addresses, coupons
```

Products support pagination (`_page`/`_limit`), search (`title_like`), filtering (`categoryId`, `brandId`), and sorting.

---

## How to Run

### Run only Next.js

```bash
npm run dev
```

### Run only JSON Server (port 3001)

```bash
npm run json-server
```

### Run both together

```bash
npm run dev:all
```

The API base URL defaults to `http://localhost:3001`. Override it with the env var:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## API Layer

All HTTP access goes through a centralized axios client in `src/services/api/client.ts`.

Flow:

```text
Component
   ↓
React Query Hook   (features/*/hooks)
   ↓
Feature API        (features/*/api)
   ↓
API Client         (axios, services/api)
   ↓
Backend (json-server)
```

Pages never call the API directly, and `fetch` is never used — axios only.

---

## React Query Architecture

- A single `QueryClient` is provided in `src/app/providers`.
- Server state lives only in React Query (no Redux/Zustand/Context duplication).
- Query keys are centralized in `src/constants/queryKeys.ts`.
- Feature hooks are the only consumer-facing interface for data.
- Defaults: `staleTime: 60s`, `retry: 1`, `refetchOnWindowFocus: false`.

---

## Container / Presenter Pattern

- **Containers** fetch data, run React Query hooks, transform data, and handle loading/error/empty states.
- **Presenters** receive props and render, with no API/business logic.

```text
Container  →  Presenter  →  UI
```

## Hard Rules

Read `RULES.md` for the full source of truth. Required conventions:

- **`type` over `interface`** — declare all types with `type`, never `interface`.
- **Simple code first** — use the simplest clean solution; no unnecessary abstractions.
- **axios only** — all HTTP calls go through the axios-based API client.
- **shadcn/ui** — all UI primitives come from shadcn/ui via the CLI.

---

## Git Branch Strategy

Use feature branches. Recommended sequence:

```text
feature/project-architecture
feature/routing
feature/json-server
feature/api-layer
feature/react-query
feature/products
feature/categories
feature/brands
feature/search
feature/cart
feature/wishlist
feature/auth
feature/profile
feature/orders
feature/checkout
feature/reviews
```

Use clean conventional commits, one feature per commit (e.g. `feat: add products feature`).

---

## Implementation Roadmap

1. Project architecture & tooling ✅
2. Routing (all placeholders) ✅
3. JSON Server mock data ✅
4. API service layer ✅
5. React Query setup + feature hooks ✅
6. Products / Categories / Brands / Search / Cart / Wishlist / Orders / Reviews features — data + container/presenter foundation ✅
7. Auth, Profile, Checkout — routes only (feature logic TBD)
8. shadcn/ui + real UI implementation (from Figma, later)

---

## Read the Rules

Before changing anything, read `RULES.md` — it is the source of truth for this project's architecture and coding rules.