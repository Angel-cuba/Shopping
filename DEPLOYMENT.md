# Deployment Guide — STRIDE Shoe Store

Guía completa: desde cero hasta la app corriendo en local (web + mobile).

---

## 1. Local Development — Backend

### Requisitos
- Java 17 (`java -version`)
- PostgreSQL corriendo en puerto **5433** (o ajustar en `application-dev.properties`)
- Maven Wrapper incluido (`./mvnw`)

### Pasos

```bash
# 1. Crear DB y usuario (primera vez)
psql -U postgres -p 5433 <<'SQL'
CREATE USER shopping_user WITH PASSWORD 'shopping123';
CREATE DATABASE shopping_db OWNER shopping_user;
GRANT ALL PRIVILEGES ON DATABASE shopping_db TO shopping_user;
SQL

# 2. Clonar y entrar al repo backend
cd Shopping_Backend

# 3. Arrancar (Flyway aplica migraciones automáticamente)
./mvnw spring-boot:run

# 4. Verificar que responde
curl -s http://localhost:8080/api/v1/products | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'OK — {len(d)} products')"

# 5. (Primera vez) Cargar seed data — 20 productos + 5 usuarios
psql -U shopping_user -d shopping_db -p 5433 -f src/main/resources/db/seed.sql
```

**Usuarios del seed:**

| Username | Email | Password | Rol |
|----------|-------|----------|-----|
| carlos.garcia | carlos.garcia@integrify.com | Admin2026! | ADMIN |
| maria.lopez | maria.lopez@gmail.com | User2026! | USER |
| alex.martin | alex.martin@hotmail.com | User2026! | USER |
| isabel.fern | isabel.fernandez@gmail.com | User2026! | USER |
| diego.torres | diego.torres@outlook.com | User2026! | USER |

---

## 2. Local Development — Frontend

### Requisitos
- Node 18+ (`node -v`)
- Backend corriendo en `:8080`

### Pasos

```bash
# 1. Entrar al repo frontend
cd Shopping

# 2. Instalar dependencias
npm install

# 3. Arrancar
npm start
# Abre http://localhost:3000 automáticamente

# 4. Verificar tests (opcional)
CI=true npm test -- --watchAll=false --no-coverage
```

El API URL está hardcodeado a `http://localhost:8080/api/v1` en `src/utils/api.ts`.

---

## 3. Local Development — Mobile App (Expo)

La app nativa vive en `Shopping_Mobile/` (repo separado).

### Requisitos
- Node 18+ (`node -v`)
- Expo CLI incluido via `npx` — no requiere instalación global
- **Para probar en simulador**: Expo Go 56+ instalado en el simulador iOS o Android Studio
- Backend corriendo en `:8080` (ver §1)

### Pasos

```bash
# 1. Entrar al repo mobile
cd Shopping_Mobile

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Arrancar el servidor Metro
CI=1 npx expo start --clear

# 4. Abrir en simulador iOS (Expo Go)
xcrun simctl openurl booted "exp://127.0.0.1:8081"
```

> **Nota:** `--legacy-peer-deps` es necesario porque Expo 56 incluye react-dom@19 que tiene un
> peer conflict con algunas dependencias. No afecta al runtime de React Native.

### Configuración de API

El archivo `Shopping_Mobile/services/api.ts` tiene la URL hardcodeada:
```ts
const baseURL = 'http://localhost:8080/api/v1';
```

En **dispositivo físico** con Expo Go, `localhost` del teléfono ≠ `localhost` del Mac.
Cambiar temporalmente la IP en `services/api.ts`:

```ts
// Obtener IP local: ipconfig getifaddr en0
const baseURL = 'http://192.168.1.X:8080/api/v1';
```

### Verificación Mobile — Checklist

```
[ ] App arranca sin errores en consola
[ ] Home tab: grid de productos carga con imágenes
[ ] Tap en producto → pantalla de detalle con tallas y variantes
[ ] Add to bag → badge en tab Cart se actualiza
[ ] Profile tab → "Sign in" visible si no autenticado
[ ] Sign in con maria.lopez@gmail.com / User2026! → sesión carga
[ ] Wishlist tab aparece (solo visible cuando autenticado)
[ ] Toggle wishlist desde PDP → corazón cambia, badge se actualiza
[ ] Cart → stepper funciona, total correcto, "Checkout" navega
[ ] Checkout → seleccionar dirección, pago, check stock → Place order
[ ] History → pedido aparece con status PENDING
[ ] Profile → logout → tabs vuelven a estado no autenticado
```

---

## 4. Verificación Local — Checklist

Recorrer este flujo antes de considerar local "listo":

```
[ ] Home carga — productos con imágenes Unsplash (no paths /images/products/...)
[ ] Filtros funcionan — categoría, precio, color, talla
[ ] PDP — selector de talla (EU), selector de variante, add to cart
[ ] Cart drawer abre — qty stepper, remove funciona, total correcto
[ ] Register — crear cuenta nueva
[ ] Login — modal centrado, JWT guardado en localStorage
[ ] Wishlist — toggle desde PDP, icono navbar con badge, ver /wishlist, remove item
[ ] Checkout — seleccionar dirección, pago, método envío → confirmar pedido
[ ] History — el pedido aparece con status PENDING
[ ] Profile — añadir/editar dirección (con campo State), añadir/eliminar tarjeta
[ ] Admin (con carlos.garcia@integrify.com / Admin2026!):
    [ ] Dashboard — stats cargan
    [ ] Orders — tabla con todos los pedidos, cambiar status
    [ ] Customers — lista de usuarios
    [ ] Products — crear/editar/borrar producto
[ ] Mobile responsive (ver §7):
    [ ] Navbar colapsa → hamburger → mobile menu con todas las secciones
    [ ] PDP — botones de talla accesibles en pantalla pequeña
    [ ] Checkout — formulario usable en mobile
    [ ] Cart drawer — scroll funciona en mobile
```

---

## 4. Mobile Web — Testing Guide

La app es responsive vía STRIDE breakpoints. No hay app nativa — se prueba en el browser.

### Probar en Chrome DevTools

1. `F12` → ícono de dispositivo (Toggle Device Toolbar) — o `Cmd+Shift+M`
2. Viewports recomendados:
   - iPhone SE: 375×667
   - iPhone 14 Pro: 390×844
   - Samsung Galaxy S22: 360×780
3. Recorrer el checklist §3 completo

### Probar en dispositivo real (local)

```bash
# Obtener IP local
ipconfig getifaddr en0   # Mac
# → ej. 192.168.1.42

# Abrir en el teléfono (misma WiFi)
# http://192.168.1.42:3000
```

### Puntos de quiebre STRIDE

| Breakpoint | Comportamiento |
|-----------|----------------|
| > 768px | Desktop — navbar links visibles, grid 3+ columnas |
| ≤ 768px | Tablet/Mobile — hamburger menu, grid 2 columnas |
| ≤ 480px | Mobile — grid 1 columna, inputs full-width |

---

## 5. Troubleshooting Rápido

| Síntoma | Causa probable | Fix |
|---------|---------------|-----|
| Imágenes rotas (`/images/products/...`) | DB tiene paths locales | Re-ejecutar `seed.sql` contra la DB |
| `401 Unauthorized` | Token expirado (1h) | Usuario debe re-loguear |
| `409 Conflict` en checkout | Stock insuficiente | Verificar `inStock > 0` en los productos |
| `500` en `POST /orders/place` | FK violation o datos inválidos | Ver logs del backend en consola |
| Flyway: `Found non-empty schema` | Schema sin `flyway_schema_history` | `baseline-on-migrate=true` ya lo resuelve (está configurado) |
| `BackendApplicationTests` falla en CI | Test de contexto Spring necesita DB real | Excluir: `./mvnw test -Dtest="!BackendApplicationTests"` |
| `CORS error` en frontend | Origin no en allowlist | Verificar que CORS en `SecurityConfig` incluye `localhost:3000` |

---

## 6. Resumen de URLs (local)

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Repo frontend | https://github.com/Angel-cuba/Shopping |
| Repo backend | https://github.com/Angel-cuba/Shopping_Backend |
| Repo mobile | https://github.com/Angel-cuba/Shopping_Mobile |
