# STRIDE Shoe Store — Frontend

React 18 + TypeScript e-commerce for footwear. Nike-style design built on the STRIDE custom design system.

**Production:** https://starlit-bienenstitch-282c7d.netlify.app  
**Backend API:** https://shopping-bhjf.onrender.com/api/v1

---

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + TypeScript |
| State | Redux Toolkit (plain thunks — no createAsyncThunk) |
| Design system | STRIDE — custom SCSS (`src/styles/stride.scss`) with CSS custom properties |
| Routing | React Router v6 (lazy + Suspense, nested admin routes) |
| HTTP | Axios (`src/utils/api.ts`) — JWT interceptor auto-injects `Authorization` header |
| Toasts | react-hot-toast (`src/utils/toasts.ts`) |
| Icons | Font Awesome 4 |
| Auth | JWT decoded client-side via `jwt-decode` |
| Tests | React Testing Library + Jest (27 E2E + unit tests + 10 checkout tests) |

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` `/home` | Public | Hero, season categories, trending, filter sidebar |
| `/product/:id` | Public | Size/variant picker, wishlist toggle, add to cart |
| `/checkout` | Auth | Address + payment picker, shipping toggle, order submit |
| `/profile` | Auth | Addresses (CRUD), payment methods (CRUD) |
| `/history` | Auth | Order list with status badge and line-item detail |
| `/wishlist` | Auth | Saved products, remove per item |
| `/admin` | ADMIN | Dashboard — live stats (customers, products, orders, revenue) |
| `/admin/orders` | ADMIN | Order table, search, status filter, inline status update |
| `/admin/customers` | ADMIN | User table with role badge |
| `/admin/products` | ADMIN | Full product CRUD with size/variant toggles |

---

## Features

### Storefront
- Product filter sidebar — category, price range, color, size
- Size buttons use EU scale (35–47) — `aria-label="EU {size}"`
- Variant color swatches — clicking a color applies a gradient tint to the PDP gallery (`resolveColor()`)
- Product images via Unsplash CDN with per-product fallback (`resolveImageUrl()`, `onImgError()`)

### Cart
- Redux-managed cart drawer (qty stepper, remove, running total)
- Composite cart item IDs: `productUUID(36) + timestamp` — `item.id.slice(0,36)` recovers product UUID

### Checkout — single atomic request
- All three previous API calls (stock decrement + order details + order) merged into `POST /orders/place`
- `shippingFee` stored as float display (`2.99`) → `Math.round()` before sending (backend expects `Integer`)
- 409 Conflict from stock check resets `allowToPay = false` with user-facing toast

### Auth
- Login modal — `position: fixed` with backdrop overlay (replaced navbar dropdown)
- Token decoded client-side: `{ user_id, role, username, sub, iat, exp }`
- `role` field used for admin guard inside `AdminLayout`
- Session bootstrap in `App.tsx` (single mount, never remounts) — eliminates wishlist race condition

### Wishlist
- Toggle from product card or PDP — optimistic update with revert-on-error
- Session loaded once in `App.tsx` to prevent stale GET overwriting optimistic state
- IDOR-safe: backend validates ownership on every mutation

### Mobile Web (Responsive)
- Hamburger opens a 320px left-side drawer (not full-screen) with slide-in animation
- Overlay backdrop closes drawer on click
- STRIDE breakpoints: ≤768px tablet/mobile, ≤480px mobile-only

### Native Mobile App (React Native + Expo)
Live in `mobile/` — full iOS/Android app sharing Redux store, actions, reducers and types with the web.

| Screen | Route |
|--------|-------|
| Product catalog (2-col grid) | `/(tabs)/` |
| Wishlist | `/(tabs)/wishlist` |
| Shopping bag | `/(tabs)/cart` |
| Profile + logout | `/(tabs)/profile` |
| Sign in (JWT + SecureStore) | `/auth/login` |
| Register | `/auth/register` |
| Product detail (size/variant picker) | `/product/[id]` |
| Checkout (stock check + order) | `/checkout` |
| Order history (lazy-loaded items) | `/history` |

Run locally: `cd mobile && npm install --legacy-peer-deps && npx expo start`

---

## Project Structure

```
src/
├── components/
│   ├── Admin/          # Customers table, order table cells
│   ├── Cart/           # CartDrawer, CartLineItem
│   ├── Navbar/         # Navbar with mobile drawer
│   ├── Product/        # ProductCard, ProductById (PDP), ProductFilters, PdpSkeleton
│   └── shared/         # OrderStatusBadge, formatOrderDate
├── interfaces/         # TypeScript types (products, orders, user, cart, wishes…)
├── pages/
│   ├── Admin/          # AdminLayout (guard), Dashboard, Orders, CreateAndCheck
│   ├── Checkout/       # Checkout.tsx + address/payment sub-steps
│   ├── User/           # Profile, UserHistory, ProfileAndAddress, ProfilePayment
│   ├── Wishlist/       # Wishlist.tsx
│   └── Info/           # Privacy, Terms, Contact, FAQ, Shipping, SizeGuide
├── redux/
│   ├── actions/        # Plain thunks (Products, Cart, Wishes, User, Address, Payment)
│   └── reducers/       # cartSlice, productSlice, userSlice, wishesSlice
├── router/             # Navigation.tsx — all routes; Home.tsx, Login.tsx
├── styles/             # stride.scss (design system tokens + components)
├── test-helpers/       # makeStore, renderWithStore, renderWithRouter
└── utils/              # api.ts, toasts.ts, authentication.ts, token.ts
```

---

## Getting Started (Local Dev)

**Requirements:** Node 18+, backend running on `:8080`

```bash
# Install
npm install

# Start (proxies to http://localhost:8080/api/v1)
npm start

# Tests
CI=true npm test -- --watchAll=false --no-coverage

# Production build
npm run build
```

> API base URL is set automatically in `src/utils/api.ts`:
> - `development` → `http://localhost:8080/api/v1`
> - `production` → `https://shopping-bhjf.onrender.com/api/v1`

---

## Key Patterns

| Pattern | Detail |
|---------|--------|
| Session bootstrap | `App.tsx` `useLayoutEffect` — runs once for the entire app lifetime. **Never** put `getWishList` in route components; they unmount/remount and create race conditions |
| Optimistic updates | Dispatch the state change before the API call; revert in `catch`. Both `addingToWishList` and `removingFromWishList` follow this pattern |
| Redux thunks | Plain async thunks — errors swallowed inside thunk; use `try/finally` for loading state cleanup |
| Auth check | `s.userLogged.userFromToken?.role === 'ADMIN'` for admin guard |
| Image fallback | `resolveImageUrl(url, name)` → `onImgError(name)` → deterministic Unsplash seed |
| Color names | `resolveColor(variant)` parses compound EU names (`"Night Maroon/Black"`) → CSS color string |
| Prices | Integers in dollars (`99` = $99). Display only — no float arithmetic |
| Test runner | `CI=true npm test` from `Shopping/` — never `npx jest` (CRA needs react-scripts) |

---

## Data Model

| Entity | Key fields |
|--------|-----------|
| Product | name, description, image, price, inStock, categories (season), variants (colors), sizes |
| User | username, email, role (`ADMIN` \| `USER`) |
| Order | orderDetails `text[]`, paymentType, shippingAddress, shippingMethod, shippingFee, total, status |
| OrderDetail | productId, variant, image, size, price, quantity, order FK |
| Address | address, city, postalCode, country, state (optional) |
| PaymentMethod | cardNumber, cardHolderName, expirationDate (`MM/YY`), provider, paymentType |
| Wishlist | userWishes `text[]` (product IDs) |

---

## Sprint History

| Sprint | Description |
|--------|-------------|
| 1 | STRIDE design system, Navbar, ProductCard, auth fixes |
| 2 | Footer, HeroSection, SeasonCards, ProductFilters sidebar, TrendingSection |
| 3 | PDP with STRIDE, wishlist toggle |
| 4 | CartDrawer with qty stepper, totals, CartLineItem |
| 5 | Auth, Profile, Order History — full STRIDE redesign |
| 6 | Admin panel — Dashboard, Orders, Customers, Products CRUD; AdminLayout guard |
| 7 | Checkout — full STRIDE redesign, step bar, address/payment selection cards |
| 8 | Atomic order endpoint (`POST /orders/place`), responsive CSS, 10 checkout tests |
| 9 | Bug fixes: `resolveImageUrl`, `resolveColor`, EU sizes, `/wishlist` page, login modal |
| 10 | Bug fixes: wishlist race condition (bootstrap moved to App.tsx), mobile drawer, color gallery tinting, Profile/Address/Payment redesign with STRIDE components |
| 11 | Native mobile app — Expo 56 + Expo Router + React Native. Phases 0-2 complete: Redux store, theme tokens, API service, useBootstrap hook, all 4 tabs, auth screens, PDP, checkout, history. Integrated as `mobile/` via git subtree. |
