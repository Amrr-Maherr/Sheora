# RULES.md

Create a `RULES.md` file in the project root.

This file is the **source of truth for the project's development rules and architecture**.

OpenCode and any future developer working on this project MUST read and follow this file before implementing or modifying any feature.

---

# Project Architecture Rules

## 1. Feature-Based Architecture

Organize the application around business features.

Each feature should own its:

- API functions
- React Query hooks
- types
- containers
- presenters
- feature-specific components
- pages

Prefer:

```text
features/
├── products/
├── categories/
├── brands/
├── cart/
├── wishlist/
├── checkout/
├── orders/
├── auth/
├── profile/
├── reviews/
└── search/
```

Avoid putting feature-specific logic inside global folders.

Only put something in `shared`, `components`, or `lib` when it is genuinely reusable across multiple features.

---

# 2. Container / Presenter Pattern

Use the **Container/Presenter pattern**.

## Container responsibilities

Containers may handle:

- React Query
- API calls through the service layer
- business logic
- data transformation
- mutations
- loading states
- error states
- orchestration

Example:

```text
ProductListContainer
```

## Presenter responsibilities

Presenters should:

- receive data through props
- render the UI
- remain as stateless as reasonably possible
- contain no API calls
- contain no React Query calls
- contain no business logic

Example:

```text
ProductListPresenter
```

Prefer:

```text
Container
   ↓
Presenter
```

Do not mix these responsibilities unnecessarily.

---

# 3. React Query Rules

Use **TanStack React Query** for server state.

Server state MUST NOT be duplicated unnecessarily in:

- Redux
- Zustand
- Context
- local component state

Use React Query for:

- fetching
- caching
- synchronization
- mutations
- invalidation
- loading states
- error states

Use appropriate query keys.

Keep query logic close to its feature.

Example:

```text
features/products/hooks/
├── useProducts.ts
├── useProduct.ts
└── useSearchProducts.ts
```

---

# 4. API Rules

API calls must not be written directly inside components.

Do not do this:

```tsx
useEffect(() => {
  fetch("/products");
}, []);
```

Prefer:

```text
Component
   ↓
React Query Hook
   ↓
Feature API
   ↓
API Client
   ↓
Backend
```

Keep API access centralized and predictable.

---

# 5. Page Rules

Pages should remain thin.

A page should primarily:

- compose feature components
- provide route-level structure
- pass route parameters
- connect containers where appropriate

Do not put large business logic inside page components.

---

# 6. UI Rules

Use **shadcn/ui** for reusable UI primitives when UI implementation starts.

Do not create custom UI primitives unnecessarily if an appropriate shadcn/ui component already exists.

Do not build the complete UI before the architecture and feature logic are ready.

---

# 7. TypeScript Rules

Use strict TypeScript.

Avoid:

```typescript
any
```

Do not use `any` as a shortcut for unresolved typing problems.

Prefer:

- explicit interfaces
- type aliases
- generics
- inferred types where appropriate

Do not create types that are only used once unless they improve readability or correctness.

---

# 8. Reusability Rules

Create a shared abstraction only when there is a real need.

Before creating a shared component, hook, utility, or service, ask:

> Is this actually used by multiple features?

If not, keep it inside the feature.

Prefer:

```text
features/products/components/ProductCard
```

over immediately creating:

```text
components/shared/UniversalCard
```

unless the component is genuinely shared.

---

# 9. NO OVER-ENGINEERING

**Over-engineering is explicitly prohibited.**

The goal is:

> Simple, maintainable, scalable code — not maximum abstraction.

Do NOT:

- create unnecessary design patterns
- create unnecessary abstraction layers
- create interfaces for every single function
- create factories without a real requirement
- create repositories when a simple API service is sufficient
- create unnecessary custom hooks
- create unnecessary providers
- create unnecessary global state
- create generic components for one use case
- create complex dependency injection
- create unnecessary utility functions
- duplicate configuration
- add libraries without a clear reason
- introduce Redux/Zustand when React Query and local state are sufficient
- create folders just to make the project look "architectural"
- create abstractions for hypothetical future requirements

---

# 10. YAGNI

Follow:

> You Aren't Gonna Need It.

Do not implement functionality just because it might be useful in the future.

Implement what the current feature requires.

Future requirements should not drive unnecessary abstractions.

---

# 11. KISS

Follow:

> Keep It Simple.

When multiple valid implementations exist:

1. Choose the simplest implementation.
2. Prefer existing project utilities.
3. Prefer existing libraries.
4. Avoid introducing a new abstraction.
5. Avoid introducing a new dependency unless necessary.

---

# 12. DRY

Follow DRY where it improves maintainability.

However:

**Do not force abstraction just to eliminate a small amount of duplication.**

Two similar components do not automatically need to become one generic component.

Readable duplication is sometimes preferable to a complicated abstraction.

---

# 13. Dependency Rules

Before installing a new dependency:

1. Check whether the functionality already exists in the project.
2. Check whether an existing dependency can solve the problem.
3. Only install a new dependency if there is a clear technical reason.

Do not add dependencies for convenience alone.

---

# 14. Backend Rules

The frontend must consume the existing backend/API contract.

Do NOT modify backend code unless explicitly requested.

Do NOT redesign backend APIs to make frontend implementation easier.

If the backend does not provide something:

- inspect the existing API
- use the available data
- identify the limitation
- do not invent a new backend architecture

For development/mock data, use the configured `json-server`.

---

# 15. Routing Rules

Keep routing centralized and predictable.

Use feature pages where appropriate.

Do not create unnecessary nested layouts or route abstractions.

Routes should map clearly to actual business functionality.

---

# 16. Error / Loading / Empty States

Every server-driven feature should be designed to support:

```text
Loading
Success
Empty
Error
```

Do not create complex state-management systems for these states.

Use React Query's existing state model whenever possible.

---

# 17. Code Organization

Prefer this flow:

```text
Route
  ↓
Page
  ↓
Container
  ↓
React Query Hook
  ↓
Feature API
  ↓
API Client
  ↓
Backend
```

And:

```text
Container
  ↓
Presenter
```

for UI rendering.

Keep responsibilities clear.

---

# 18. Before Creating Anything New

Before creating a:

- component
- hook
- service
- utility
- provider
- context
- store
- abstraction
- dependency

check whether an existing solution already exists.

Reuse existing code when appropriate.

---

# 19. Modification Rules

When modifying existing code:

- do not rewrite unrelated code
- do not refactor unrelated files
- do not rename things without a reason
- do not change architecture unnecessarily
- do not introduce new patterns without justification
- keep changes scoped to the current feature

---

# 20. Feature Completion Checklist

Before considering a feature complete:

- [ ] Correct feature folder
- [ ] Correct route
- [ ] Correct API layer
- [ ] React Query used for server state
- [ ] Container/Presenter separation where applicable
- [ ] Proper TypeScript types
- [ ] Loading state considered
- [ ] Error state considered
- [ ] Empty state considered
- [ ] No unnecessary global state
- [ ] No unnecessary dependency
- [ ] No unnecessary abstraction
- [ ] No over-engineering
- [ ] Existing architecture preserved
- [ ] Build passes

---

# 21. Priority Rule

When architectural decisions conflict, use this priority:

```text
Correctness
    ↓
Simplicity
    ↓
Maintainability
    ↓
Reusability
    ↓
Abstraction
```

Do not sacrifice simplicity just to create a theoretically reusable architecture.

---

# 22. Golden Rule

Always ask:

> "What is the simplest clean solution that follows the existing architecture?"

If the answer does not require an abstraction, **do not create one**.

If a feature can be implemented with a simple component, hook, or service, do not create a complex architecture around it.

The project should remain understandable to a frontend developer who joins the project later.