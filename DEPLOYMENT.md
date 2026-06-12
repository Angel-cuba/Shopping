# Deployment Guide — STRIDE Shoe Store

Guía completa: desde cero hasta la app corriendo en local y en producción (web + mobile-responsive).

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

El API URL cambia automáticamente según `NODE_ENV` (`src/utils/api.ts`):
- `development` → `http://localhost:8080/api/v1`
- `production` → `https://shopping-bhjf.onrender.com/api/v1`

---

## 3. Local Development — Mobile App (Expo)

La app nativa vive en `Shopping/mobile/` dentro del mismo repo.

### Requisitos
- Node 18+ (`node -v`)
- Expo CLI incluido via `npx` — no requiere instalación global
- **Para probar en dispositivo físico**: app [Expo Go](https://expo.dev/go) en iOS o Android
- **Para probar en simulador**: Xcode instalado (iOS) o Android Studio (Android)
- Backend corriendo en `:8080` (ver §1)

### Pasos

```bash
# 1. Entrar a la carpeta mobile
cd Shopping/mobile

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Arrancar el servidor Expo
npx expo start

# Opciones en el menú interactivo:
#   i → iOS Simulator
#   a → Android Emulator
#   w → Web (limitado, solo para debug)
#   Escanear QR con Expo Go en el teléfono (misma WiFi que el Mac)
```

> **Nota:** `--legacy-peer-deps` es necesario porque Expo 56 incluye react-dom@19 que tiene un
> peer conflict con algunas dependencias. No afecta al runtime de React Native.

### Configuración de API

El archivo `mobile/services/api.ts` cambia la URL automáticamente:
- `__DEV__ = true` (Expo dev server) → `http://localhost:8080/api/v1`
- `__DEV__ = false` (EAS Build prod) → `https://shopping-bhjf.onrender.com/api/v1`

En **dispositivo físico** con Expo Go, `localhost` del teléfono ≠ `localhost` del Mac.
Reemplazar temporalmente en `services/api.ts`:

```ts
// Cambiar por tu IP local (obtener con: ipconfig getifaddr en0)
const baseURL = __DEV__ ? 'http://192.168.1.X:8080/api/v1' : 'https://shopping-bhjf.onrender.com/api/v1';
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

## 4. Production Deployment — Backend (Render.com)

El backend ya está deployado. Estos pasos sirven para re-deploy o configurar desde cero.

### Variables de entorno en Render

En el panel de Render → Environment:

| Variable | Valor |
|----------|-------|
| `DB_HOST` | host del PostgreSQL de Render |
| `DB_PORT` | `5432` |
| `DB_NAME` | nombre de la DB en Render |
| `DB_USERNAME` | usuario de la DB |
| `DB_PASSWORD` | password de la DB |
| `SECRET_KEY` | clave JWT ≥32 chars (diferente a dev) |
| `SPRING_PROFILES_ACTIVE` | `prod` |

### Flyway en producción

La primera vez que arranque contra la DB de producción:
1. Flyway detecta que no hay `flyway_schema_history`
2. Con `baseline-on-migrate=true` y schema existente → marca como V0 y aplica V1
3. Con DB nueva (vacía) → aplica V1 directamente desde cero

### Verificar deploy

```bash
# Products cargando
curl -s https://shopping-bhjf.onrender.com/api/v1/products \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'OK — {len(d)} products')"

# Auth funcionando
curl -s -X POST https://shopping-bhjf.onrender.com/api/v1/users/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.garcia@integrify.com","password":"Admin2026!"}' \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print('JWT OK' if r.get('token') else 'ERROR: '+str(r))"
```

> **Nota Render free tier:** el servidor "hiberna" tras 15 min de inactividad. El primer request tarda ~30s (cold start). En una demo real, hacer un request previo para "despertarlo" antes de presentar.

---

## 5. Production Deployment — Frontend (Netlify)

El frontend ya está deployado en Netlify. Pasos para re-deploy o configurar desde cero.

### Configuración en Netlify

| Setting | Valor |
|---------|-------|
| Base directory | `Shopping` |
| Build command | `npm run build` |
| Publish directory | `build` |
| Node version | `18` |

### Redirects para React Router

Sin esto, cualquier refresh en `/product/abc` o `/wishlist` da 404 en Netlify.

Verificar que existe `Shopping/public/_redirects`:
```
/*  /index.html  200
```

Si no existe, crear ese archivo y hacer deploy.

### Verificar deploy

```bash
# Responde 200
curl -s -o /dev/null -w "%{http_code}" https://starlit-bienenstitch-282c7d.netlify.app
# → 200

# Sin CORS errors: abrir DevTools → Network → ver que requests a Render llevan
# Authorization: Bearer eyJ... y responden sin error de CORS
```

---

## 6. Verificación Production — Checklist

```
[ ] https://starlit-bienenstitch-282c7d.netlify.app carga
[ ] Productos con imágenes Unsplash (no paths locales /images/products/...)
[ ] Login con carlos.garcia@integrify.com / Admin2026!
[ ] Flujo completo: add to cart → checkout → pedido confirmado
[ ] Pedido aparece en /history
[ ] /admin carga con stats reales de la DB de prod
[ ] DevTools Network: sin errores CORS
[ ] DevTools Network: requests llevan header Authorization: Bearer ...
[ ] Render cold start: primer request puede tardar ~30s (normal en free tier)
```

---

## 7. Mobile Web — Testing Guide

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

## 8. Troubleshooting Rápido

| Síntoma | Causa probable | Fix |
|---------|---------------|-----|
| `CORS error` en producción | Origin no en allowlist | Verificar Netlify URL en `SecurityConfig.corsConfigurationSource()` y en `@CrossOrigin` de cada controller |
| Imágenes rotas (`/images/products/...`) | DB tiene paths locales | Re-ejecutar `seed.sql` contra la DB |
| `401 Unauthorized` | Token expirado (1h) | Usuario debe re-loguear |
| `409 Conflict` en checkout | Stock insuficiente | Verificar `inStock > 0` en los productos |
| `500` en `POST /orders/place` | FK violation o datos inválidos | Ver logs del backend en Render |
| Render: `Application failed to start` | Variable de entorno faltando | Verificar todas las vars en panel de Render |
| Flyway: `Found non-empty schema` | Schema sin `flyway_schema_history` | `baseline-on-migrate=true` ya lo resuelve (está configurado) |
| `BackendApplicationTests` falla en CI | Test de contexto Spring necesita DB real | Excluir: `./mvnw test -Dtest="!BackendApplicationTests"` |
| Refresh en `/product/abc` da 404 | Falta `_redirects` en Netlify | Crear `public/_redirects` con `/* /index.html 200` |
| Render cold start lento (~30s) | Free tier hiberna tras 15 min | Hacer un GET a `/api/v1/products` antes de la demo para despertar el servidor |

---

## 9. Resumen de URLs y repos

| Recurso | URL |
|---------|-----|
| Frontend (prod) | https://starlit-bienenstitch-282c7d.netlify.app |
| Backend API (prod) | https://shopping-bhjf.onrender.com/api/v1 |
| Frontend (dev) | http://localhost:3000 |
| Backend API (dev) | http://localhost:8080/api/v1 |
| Repo frontend | https://github.com/Angel-cuba/Shopping |
| Repo backend | https://github.com/Angel-cuba/Shopping_Backend |
