# E-commerce Frontend Project Setup

You are working on an e-commerce frontend project.

Your task is to set up the **project architecture, routes, data layer, feature structure, and reusable patterns only**.

## Important Rules

- Do NOT build any real UI.
- Do NOT implement final designs.
- Do NOT add unnecessary styling.
- Every page must contain only a simple placeholder indicating the page name.
- Do NOT change the existing backend.
- Use `json-server` as the temporary data source.
- Follow React best practices and clean architecture.
- Use the **Container/Presenter pattern** (also known as Smart/Dumb Components).
- Use **TanStack React Query** for server-state fetching and caching.
- Use **shadcn/ui** only for future UI components; do not build the actual UI now.
- Use TypeScript.
- Keep the architecture scalable for a production e-commerce application.
- Avoid over-engineering.
- Do not create abstractions unless they are actually useful.

---

# 1. Project Architecture

Organize the project using a feature-based architecture.

Use a structure similar to:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── brands/
│   ├── cart/
│   ├── wishlist/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   ├── reviews/
│   └── search/
│
├── services/
│   ├── api/
│   └── query/
│
├── hooks/
├── lib/
├── types/
├── constants/
└── routes/
```

Keep feature-specific logic inside the corresponding feature whenever possible.

---

# 2. Routing

Create the standard routes expected in an e-commerce store.

## Public Routes

```text
/
```

Home page.

```text
/products
```

Products listing.

```text
/products/:id
```

Product details.

```text
/categories
```

Categories listing.

```text
/categories/:slug
```

Products filtered by category.

```text
/brands
```

Brands listing.

```text
/brands/:slug
```

Products filtered by brand.

```text
/search
```

Search results.

```text
/cart
```

Shopping cart.

```text
/wishlist
```

Wishlist.

---

# 3. Authentication Routes

Create routes for:

```text
/login
/register
/forgot-password
/reset-password
```

These should only contain placeholders for now.

Do not implement real authentication.

---

# 4. Customer Account Routes

Create:

```text
/account
/account/profile
/account/orders
/account/orders/:id
/account/addresses
/account/wishlist
```

Only create the routing and page placeholders.

---

# 5. Checkout Routes

Create:

```text
/checkout
/checkout/shipping
/checkout/payment
/checkout/review
/checkout/success
```

Do not implement payment logic.

Do not connect to a real payment provider.

---

# 6. Error/System Routes

Create:

```text
/404
```

and a proper fallback for unknown routes.

Also prepare the structure for:

```text
loading
error
empty
```

states where appropriate.

---

# 7. JSON Server

Use `json-server` as the temporary backend.

Create:

```text
db.json
```

at the project root.

Create realistic mock data for:

```text
users
products
categories
brands
orders
cart
wishlist
reviews
addresses
coupons
```

The data should be relational enough to simulate a real e-commerce API.

Example product structure:

```json
{
  "id": "1",
  "title": "Product Name",
  "slug": "product-name",
  "description": "Product description",
  "price": 100,
  "compareAtPrice": 120,
  "currency": "USD",
  "images": [],
  "categoryId": "1",
  "brandId": "1",
  "rating": 4.5,
  "reviewCount": 20,
  "stock": 50,
  "isFeatured": true,
  "isActive": true
}
```

Create enough data to test:

- pagination
- search
- filtering
- sorting
- product details
- categories
- brands
- cart
- wishlist
- orders
- reviews

Do not use external APIs.

---

# 8. API Layer

Create a centralized API client.

For example:

```text
services/api/
```

Create reusable API functions such as:

```text
getProducts()
getProductById()
getProductsByCategory()
getProductsByBrand()
searchProducts()

getCategories()
getCategoryById()

getBrands()
getBrandById()

getOrders()
getOrderById()

getReviews()
getWishlist()
getCart()
```

Do not put API calls directly inside page components.

---

# 9. TanStack React Query

Use **TanStack React Query** for all server-state operations.

Create reusable query hooks inside the relevant features.

Example:

```text
features/products/
├── api/
├── hooks/
├── components/
├── pages/
├── types/
└── index.ts
```

Example hooks:

```text
useProducts()
useProduct(id)
useProductsByCategory(categoryId)
useProductsByBrand(brandId)
useSearchProducts(query)
```

Use proper:

- query keys
- staleTime
- caching
- loading states
- error states
- invalidation where required

Do not use React state for server data when React Query should manage it.

---

# 10. Container / Presenter Pattern

Follow the **Container/Presenter pattern**.

### Container

Responsible for:

- data fetching
- React Query hooks
- business logic
- transformations
- mutations
- handling loading/error states

Example:

```text
ProductListContainer
```

### Presenter

Responsible only for:

- receiving props
- rendering UI
- displaying data

Example:

```text
ProductListPresenter
```

Do NOT put API calls inside Presenter components.

Do NOT put business logic inside Presenter components.

For example:

```text
features/products/components/
├── ProductListContainer.tsx
└── ProductListPresenter.tsx
```

Even though the UI is currently only a placeholder, establish this pattern where it makes sense.

---

# 11. Pages

Every route should have a page component.

Pages should remain thin.

Example:

```tsx
export default function ProductsPage() {
  return <div>Products Page</div>;
}
```

Do not build actual UI.

Do not create cards, grids, forms, headers, footers, filters, or navigation UI yet.

Only establish the page structure and architecture.

---

# 12. shadcn/ui

Prepare the project for shadcn/ui.

Do not build the actual store UI yet.

If a component is needed for the architecture, use shadcn/ui conventions.

Do not install dozens of components that are not currently required.

---

# 13. State Management

Separate state types correctly.

### Server state

Use:

```text
TanStack React Query
```

### Local UI state

Use:

```text
useState
useReducer
```

when appropriate.

### Global client state

Only introduce Zustand/Redux if there is a genuine requirement.

Do NOT add Redux just because this is an e-commerce application.

---

# 14. Types

Create shared TypeScript types.

For example:

```text
types/
├── product.ts
├── category.ts
├── brand.ts
├── user.ts
├── order.ts
├── cart.ts
├── wishlist.ts
├── review.ts
└── address.ts
```

Avoid using:

```typescript
any
```

unless absolutely unavoidable.

---

# 15. Git Branch Strategy

Create a clean branch strategy.

Use feature branches based on the actual implementation features.

Suggested branches:

```text
feature/project-architecture
feature/routing
feature/json-server
feature/api-layer
feature/react-query
feature/auth
feature/products
feature/categories
feature/brands
feature/search
feature/cart
feature/wishlist
feature/checkout
feature/orders
feature/profile
feature/reviews
```

Do NOT create all branches automatically if the Git workflow does not require it.

Instead, document the recommended branch sequence in the README.

Recommended implementation order:

```text
feature/project-architecture
        ↓
feature/routing
        ↓
feature/json-server
        ↓
feature/api-layer
        ↓
feature/react-query
        ↓
feature/products
        ↓
feature/categories
        ↓
feature/brands
        ↓
feature/search
        ↓
feature/cart
        ↓
feature/wishlist
        ↓
feature/auth
        ↓
feature/profile
        ↓
feature/orders
        ↓
feature/checkout
        ↓
feature/reviews
```

---

# 16. Git Commits

Use clean conventional commits.

Examples:

```text
chore: setup project architecture
feat: add ecommerce routes
feat: setup json server mock data
feat: add api service layer
feat: setup react query
feat: add products feature
feat: add categories feature
feat: add brands feature
feat: add search feature
feat: add cart feature
feat: add wishlist feature
feat: add authentication routes
feat: add customer account routes
feat: add orders feature
feat: add checkout routes
feat: add reviews feature
```

Do not make giant commits containing unrelated features.

---

# 17. README

Update the README with:

- project overview
- technology stack
- folder structure
- routing structure
- feature structure
- JSON Server setup
- how to run the project
- how to run JSON Server
- React Query architecture
- Container/Presenter pattern
- Git branch strategy
- implementation roadmap

Example scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "json-server": "json-server --watch db.json --port 3001",
    "dev:all": "concurrently \"npm run dev\" \"npm run json-server\""
  }
}
```

Use the project's existing framework and scripts if they already exist. Do not overwrite working configuration unnecessarily.

---

# 18. Critical Constraints

Before making changes:

1. Inspect the existing project.
2. Understand the current framework and dependencies.
3. Reuse existing infrastructure whenever possible.
4. Do not rewrite the project unnecessarily.
5. Do not change backend architecture.
6. Do not build UI.
7. Do not introduce unnecessary libraries.
8. Do not duplicate API logic.
9. Do not put server-state logic inside Presenters.
10. Keep pages thin.
11. Keep features isolated.
12. Keep TypeScript strict.
13. Make the architecture ready for the actual Figma implementation later.

---

# Final Requirement

At the end:

1. Show the final folder structure.
2. Show all implemented routes.
3. Show the JSON Server entities.
4. Show the React Query architecture.
5. Show the Container/Presenter structure.
6. Show the recommended Git branches.
7. List all files created or modified.
8. Verify that the project builds successfully.
9. Verify that JSON Server starts successfully.
10. Do not implement any actual UI beyond simple page placeholders.

Do not stop after creating the architecture. Implement the complete requested foundation and verify it.