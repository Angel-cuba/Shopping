# MVP Checklist — STRIDE Shoe Store

Estado actual: **funcionalidad completa, listo para demostrar**. Los items siguientes son lo que separa el estado actual del MVP deployado y verificado.

---

## Blocker real (único pendiente de código)

### ~~1. `address.state` — campo falta en el formulario frontend~~
✅ **Completado** — campo añadido en `ProfileAndAddress.tsx` + `UserAddress` interface actualizada.

---

## Pendiente operacional (no requiere código)

### 1. `.env.example` — documentar variables de entorno requeridas

Ninguno de los dos repos tiene un `.env.example`. Cualquier persona que clone el proyecto no sabe qué variables necesita.

**Backend** — crear `Shopping_Backend/.env.example`:
```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=shopping_db
DB_USERNAME=shopping_user
DB_PASSWORD=yourpassword
SECRET_KEY=at_least_32_chars_for_HS256_jwt_secret_key
```

---

## Nice-to-have antes del demo final

| Item | Dificultad | Impacto |
|------|-----------|---------|
| Paginación en lista de productos | Media | Evita cargar 20+ productos de golpe |
| Search bar global por nombre de producto | Media | Feature visible que impresiona |
| Image upload para admin (vs URL input) | Alta | Admin más realista |
| Empty state en filtros sin resultados | Baja | UX básica — mostrar mensaje cuando no hay match |
| Wishlist link con label en desktop nav | Baja | Actualmente solo icono; añadir texto "Wishlist" mejoraría el descubrimiento |

---

## Post-MVP (fuera del scope del bootcamp)

- Procesamiento de pagos real (Stripe)
- Email de confirmación de pedido
- Recuperación de contraseña
- Social login (Google OAuth — deps instaladas, backend no conectado)
- PWA / manifest para instalación móvil

---

## Estado de tests

| Suite | Estado |
|-------|--------|
| `ShoppingFlow.test.tsx` (E2E frontend) | ✅ 27/27 |
| `Checkout.test.tsx` | ✅ 10/10 |
| `OrderServiceTest` | ✅ 7/7 |
| `OrderControllerTest` | ✅ 4/4 |
| `WishesControllerTest` | ✅ 3/3 |
| `BackendApplicationTests` | ⚠️ Falla sin DB en CI — pre-existente, esperado |

---

## Seguridad implementada

- ✅ JWT en cada request autenticado
- ✅ ADMIN guard: rutas de admin restringidas por rol
- ✅ IDOR guards en Wishlist (403 si usuario ≠ dueño del recurso)
- ✅ Stock validation antes de cualquier write en `placeOrder()`
- ✅ `@Transactional` — rollback completo si cualquier fase falla
- ✅ Endpoints deprecated restringidos a ADMIN
- ✅ BCrypt passwords
- ✅ `ddl-auto=validate` — Flyway es el único dueño del DDL en todos los perfiles
