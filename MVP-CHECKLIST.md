# MVP Checklist — STRIDE Shoe Store

Estado actual: **MVP completo — código, tests y docs listos para demo**.

---

## Completado ✅

| Item | Commit |
|------|--------|
| `address.state` en form frontend + `UserAddress` type | `d53997b` |
| `public/_redirects` — Netlify routing sin 404 en refresh | `880c89d` |
| `.env.example` en backend | `68df6a2` |
| Tests corregidos tras `saveAll()` migration (`OrderServiceTest`) | `68df6a2` |
| `WishesControllerTest` PUT — mocks correctos para IDOR path | `68df6a2` |
| `WishesController.resolveAuthenticatedUser()` null-guard | `68df6a2` |
| `UserController` refactor + null-guard consistente | `e2758b1` |
| Constructor injection en todos los services y controllers (0 `@Autowired`) | `e2758b1` |
| `OrderRepository.findOrdersByUserId` JOIN FETCH (N+1 eliminado) | `68df6a2` |
| `WishesService.get()` simplificado | `e2758b1` |
| DEPLOYMENT.md + MVP-CHECKLIST.md en repo | `d53997b` |

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
