# MVP Checklist — STRIDE Shoe Store

Estado actual: **MVP completo — código, tests y docs listos para demo**.

---

## Completado ✅

| Item | Sprint | Commit |
|------|--------|--------|
| STRIDE design system, Navbar, ProductCard, auth | 1 | — |
| Footer, Hero, SeasonCards, ProductFilters, Trending | 2 | — |
| PDP con STRIDE, wishlist toggle | 3 | — |
| CartDrawer qty stepper, totals | 4 | — |
| Auth, Profile, Order History STRIDE | 5 | — |
| Admin panel completo (Dashboard, Orders, Customers, Products) | 6 | — |
| Checkout STRIDE redesign + step bar | 7 | — |
| `POST /orders/place` atómico, responsive, 10 checkout tests | 8 | `96e7648` / `f89557d` |
| `resolveImageUrl`, `resolveColor`, EU sizes, `/wishlist`, login modal | 9 | — |
| `address.state` en form + `UserAddress` type | 9 | `d53997b` |
| `public/_redirects` — Netlify routing sin 404 en refresh | 9 | `880c89d` |
| `.env.example` en backend | 9 | `68df6a2` |
| Tests corregidos tras `saveAll()` migration | 9 | `68df6a2` |
| `WishesControllerTest` PUT — mocks correctos | 9 | `68df6a2` |
| `WishesController.resolveAuthenticatedUser()` null-guard | 9 | `68df6a2` |
| `UserController` refactor + null-guard consistente | 9 | `e2758b1` |
| Constructor injection en todos los services (0 `@Autowired`) | 9 | `e2758b1` |
| `OrderRepository.findOrdersByUserId` JOIN FETCH (N+1 eliminado) | 9 | `68df6a2` |
| DEPLOYMENT.md + MVP-CHECKLIST.md en repo | 9 | `d53997b` |
| Wishlist race condition fix (bootstrap en App.tsx, no Home.tsx) | 10 | — |
| Hamburger → drawer lateral 320px con animación slide-in | 10 | — |
| PDP gallery color tinting al cambiar variante | 10 | — |
| Profile / Address / Payment redesign con STRIDE components | 10 | — |
| Dead code removal (WishesActions unused exports) | 10 | — |
| **Native mobile app — Expo 56 + Expo Router + React Native** | **11** | **monorepo `mobile/`** |
| Redux store + theme tokens (colors, spacing, typography) + API service (axios + SecureStore) | 11 | — |
| `useBootstrap` hook — session rehydration from SecureStore (mirrors App.tsx pattern) | 11 | — |
| 4 tabs: Store (product grid), Wishlist, Cart (stepper), Profile (logout + admin badge) | 11 | — |
| Auth screens: Login (JWT decode + SecureStore), Register | 11 | — |
| Product detail: size/variant picker, wishlist toggle, add to bag | 11 | — |
| Checkout: address/payment picker modals, stock check loop, `POST /orders/place` | 11 | — |
| Order history: `GET /orders/:id` + lazy-loaded order items per order | 11 | — |

---

## Pendiente operacional

### `.env.example` frontend
El sandbox protege archivos `.env*` — no se puede crear automáticamente. Crear manualmente:
```
# Shopping/.env.example
# No variables required for local dev — API URL switches automatically.
# Optional: override production API URL
# REACT_APP_API_URL=https://shopping-bhjf.onrender.com/api/v1
```

---

## Nice-to-have (post-demo)

| Item | Dificultad | Impacto |
|------|-----------|---------|
| Search bar global por nombre de producto | Media | Feature visible que impresiona |
| Paginación en lista de productos | Media | Evita cargar 20+ productos de golpe |
| Image upload para admin (vs URL input) | Alta | Admin más realista |
| PWA manifest + service worker | Baja | App instalable desde el browser |
| ~~App móvil nativa (React Native + Expo)~~ | ~~Alta~~ | ✅ Completado en Sprint 11 — ver `mobile/` |

> Empty state en filtros: ✅ ya existe (`ProductNotFound` component en `Products.tsx:168`)  
> Wishlist en navbar: ✅ ya existe (icono de corazón con badge + en mobile menu)

---

## Estado de tests

| Suite | Cobertura | Estado |
|-------|-----------|--------|
| `ShoppingFlow.test.tsx` | E2E fullstack | ✅ 27/27 |
| `Checkout.test.tsx` | Checkout flow | ✅ 10/10 |
| `OrderServiceTest` | `placeOrder()` + stock + validaciones | ✅ 7/7 |
| `OrderControllerTest` | HTTP layer + auth | ✅ 10/10 |
| `WishesControllerTest` | IDOR guards POST/PUT/DELETE/GET | ✅ 17/17 |
| **Total backend** | | **✅ 34/34** |
| `BackendApplicationTests` | Contexto Spring (necesita DB) | ⚠️ pre-existente, esperado |

---

## Seguridad implementada

- ✅ JWT en cada request autenticado — `JwtFilter` (`OncePerRequestFilter`)
- ✅ ADMIN-only: listas globales, product mutations, status updates, deprecated endpoints
- ✅ IDOR guards en Wishlist (403 si usuario ≠ dueño; admin bypass)
- ✅ IDOR guards en User PUT/DELETE (403 si usuario ≠ dueño; admin bypass; role escalation bloqueado)
- ✅ Stock validation atómica en Phase 1 antes de cualquier write
- ✅ `@Transactional` — rollback total si cualquier fase de `placeOrder()` falla
- ✅ `ddl-auto=validate` en todos los perfiles — Flyway es el único dueño del DDL
- ✅ BCrypt passwords (seed + runtime)
- ✅ `@NotBlank`/`@NotNull`/`@Positive` en `PlaceOrderRequest`
- ✅ 0 `@Autowired` en producción — constructor injection en todos los components

---

## Post-MVP (fuera del scope del bootcamp)

- Procesamiento de pagos real (Stripe)
- Email de confirmación de pedido
- Recuperación de contraseña
- Social login (Google OAuth — deps instaladas, backend no conectado)
- PWA / manifest para instalación móvil
- **App nativa iOS/Android** (ver plan en `MOBILE-PLAN.md`)
