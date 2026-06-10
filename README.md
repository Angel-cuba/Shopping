# STRIDE Shoe Store

A full-stack e-commerce application for footwear, built with React 18 and Spring Boot 3.

**Frontend:** Coming soon!  
**Backend:** Coming soon!

---

## Stack

| Layer | Tech |
|-------|------|
| UI framework | React 18 + TypeScript |
| State | Redux Toolkit (plain thunks) |
| Design system | STRIDE — custom SCSS (`src/styles/stride.scss`) with CSS custom properties |
| Routing | React Router v6 (lazy + nested routes) |
| HTTP | Axios (`src/utils/api.ts`) with JWT interceptor |
| Toasts | react-hot-toast (`src/utils/toasts.ts`) |
| Icons | Font Awesome 4 |
| Auth | JWT decoded client-side via `jwt-decode` |

---

## Features

### Storefront
- **Home** — hero section, season category cards, trending products, product filter sidebar (category, price, color, size)
- **Product detail** — size/variant picker, wishlist toggle, add to cart with quantity
- **Cart drawer** — quantity stepper, line-item remove, order total, checkout link

### User
- **Auth** — login / register with JWT; Redux stores decoded token (`user_id`, `role`)
- **Profile** — address management (add / edit / delete), payment method management
- **Order history** — per-order item breakdown with status badge and date

### Checkout
- Address picker (from saved addresses), payment picker (from saved cards)
- Shipping method toggle — home delivery vs store pickup
- Stock check before confirming; order creation via API

### Admin (`/admin` — ADMIN role only)
- **Dashboard** — live stat cards: customers, products, orders, revenue + quick-action links
- **Orders** — full order list, search by name/email, status filter, inline status update
- **Customers** — user table with search and role badge
- **Products** — full CRUD: create/edit form with size & variant toggles, product table with image thumbnails, edit/delete

---

## Project Structure

```
src/
├── components/
│   ├── Admin/          # Admin sub-components
│   ├── Cart/           # CartDrawer, CartLineItem
│   ├── Product/        # ProductCard, ProductById (PDP), ProductFilters
│   ├── shared/         # OrderStatusBadge, formatOrderDate
│   └── ...
├── interfaces/         # TypeScript types (products, orders, user, cart…)
├── pages/
│   ├── Admin/          # AdminLayout, AdminDashboard, AdminOrders, CreateAndCheck
│   ├── Checkout/       # Checkout + sub-pages (address, payment)
│   ├── User/           # Profile, History
│   └── ...
├── redux/
│   ├── actions/        # Plain thunks (ProductActions, CartActions…)
│   └── reducers/
├── router/             # Navigation.tsx — nested routes
├── styles/             # stride.scss (design system), tokens
├── test-helpers/       # Shared test utilities (makeStore, renderWithStore)
└── utils/              # api.ts, toasts.ts, authentication.ts, token.ts
```

---

## Getting Started

```bash
# Install
npm install

# Development (requires backend on :8080)
npm start

# Tests
CI=true npm test -- --watchAll=false

# Production build
npm run build
```

**Environment**: no `.env` file required for dev — API base URL switches automatically:
- `development` → `http://localhost:8080/api/v1`
- `production`  → ``

---

## Data Model

| Entity | Key fields |
|--------|-----------|
| Product | name, description, image, price, inStock, categories (season), variants (colors), sizes |
| User | username, email, role (ADMIN \| USER) |
| Order | orderDetails[], paymentType, shippingAddress, shippingMethod, shippingFee, total, status |
| OrderDetail | productId, variant, size, price, quantity |
| Address | street, city, country, zipCode |
| PaymentMethod | cardNumber, cardHolder, expirationDate |
