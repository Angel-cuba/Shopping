# STRIDE Mobile — Plan Completo

App nativa iOS + Android para la tienda STRIDE usando **React Native + Expo**.

---

## Decisión arquitectónica

### ¿Por qué Expo (React Native)?

| Opción | Pros | Contras | Veredicto |
|--------|------|---------|-----------|
| **Expo (RN)** | Reutiliza Redux + types + API; iOS+Android desde un codebase; Expo Go para testing inmediato; Expo Router = file-based igual que RR v6 | UI completa se reescribe (no hay SCSS en RN) | ✅ **Elegida** |
| Capacitor / Ionic | Envuelve la web existente; 0 reescritura UI | Rendimiento inferior; no native feel; gestos artificiales | ❌ |
| PWA | Coste 0; ya es responsive | No se puede publicar en App Store; sin push notifications; acceso limitado a hardware | ❌ para store |
| Flutter | Excelente rendimiento | Stack completamente diferente; 0 reutilización de código | ❌ |

### Código reutilizable del proyecto web

| Módulo | Reutilizable | Acción |
|--------|-------------|--------|
| `src/interfaces/` | ✅ 100% | Mover a `packages/shared` |
| `src/redux/actions/` | ✅ 100% | Mover a `packages/shared` |
| `src/redux/reducers/` | ✅ 100% | Mover a `packages/shared` |
| `src/utils/api.ts` | ✅ 100% (Axios funciona en RN) | Mover a `packages/shared` |
| `src/utils/authentication.ts` | ✅ con ajuste | `localStorage` → `expo-secure-store` |
| `src/utils/token.ts` | ✅ 100% | Mover a `packages/shared` |
| `src/utils/toasts.ts` | ⚠️ Reemplazar | `react-hot-toast` → `react-native-toast-message` |
| `src/styles/` | ❌ No aplica | Reescribir como `StyleSheet` + theme object |
| `src/components/` | ❌ No aplica | Reescribir como componentes RN |
| `src/router/Navigation.tsx` | ❌ No aplica | Reemplazar por Expo Router |

**Estimación de reutilización: ~45% del codebase** (toda la lógica de negocio + estado + API).

---

## Estructura objetivo — Monorepo

```
Integrify/Shopping/
├── Shopping/                    # Web app (existente — sin cambios)
├── Shopping_Backend/            # Spring Boot API (sin cambios)
├── Shopping_Mobile/             # App Expo (nueva)
│   ├── app/                     # Expo Router — file-based navigation
│   │   ├── (tabs)/
│   │   │   ├── index.tsx        # Home — catalog
│   │   │   ├── search.tsx       # Search
│   │   │   ├── wishlist.tsx     # Wishlist
│   │   │   └── profile.tsx      # Profile tabs
│   │   ├── product/[id].tsx     # PDP
│   │   ├── checkout.tsx         # Checkout
│   │   ├── history.tsx          # Order history
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   └── admin/               # Admin screens (role guard)
│   │       ├── index.tsx
│   │       ├── orders.tsx
│   │       ├── products.tsx
│   │       └── customers.tsx
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── CartSheet.tsx        # Bottom sheet (react-native-bottom-sheet)
│   │   ├── SizeGrid.tsx
│   │   ├── SwatchRow.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── shared/
│   ├── store/                   # Redux store para mobile
│   │   └── index.ts             # Mismo store, importa actions/reducers de shared
│   ├── theme/
│   │   ├── colors.ts            # STRIDE tokens como objeto TS
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useBootstrap.ts      # Equivalente del useLayoutEffect de App.tsx
│   ├── utils/
│   │   └── storage.ts           # expo-secure-store wrapper (reemplaza localStorage)
│   └── package.json
└── packages/
    └── shared/                  # Código compartido web + mobile
        ├── interfaces/          # ← copiado de Shopping/src/interfaces/
        ├── redux/
        │   ├── actions/         # ← copiado de Shopping/src/redux/actions/
        │   └── reducers/        # ← copiado de Shopping/src/redux/reducers/
        ├── utils/
        │   ├── api.ts           # ← copiado de Shopping/src/utils/api.ts
        │   └── token.ts
        └── package.json
```

---

## Estado actual — Junio 2026

La app vive en `Shopping/mobile/` (integrada via git subtree desde `Shopping_Mobile`).
Repo: `Angel-cuba/Shopping` branch `main`.

| Fase | Estado | Pantallas entregadas |
|------|--------|---------------------|
| 0 — Setup | ✅ Completada | Redux store, theme tokens, API service, useBootstrap |
| 1 — Home + Catalog | ✅ Completada | `/(tabs)/index`, `/(tabs)/wishlist` |
| 2 — PDP + Wishlist | ✅ Completada | `/product/[id]`, tab wishlist completa |
| Auth (antes Fase 3) | ✅ Completada | `/auth/login`, `/auth/register` |
| Cart (antes Fase 4) | ✅ Completada | `/(tabs)/cart` con stepper |
| Checkout (antes Fase 4) | ✅ Completada | `/checkout` — stock check + POST /orders/place |
| Perfil (antes Fase 5) | ✅ Completada | `/(tabs)/profile` con logout |
| Historial (antes Fase 5) | ✅ Completada | `/history` — lazy-loaded order items |
| 6 — Admin | ⬜ Pendiente | `/admin/` screens |
| 7 — Polish + Deploy | ⬜ Pendiente | EAS Build, push notifications |

**Para correr en local:**
```bash
cd Shopping/mobile
npm install --legacy-peer-deps
npx expo start
```

---

## Fases de desarrollo

### Fase 0 — Setup ✅ COMPLETADA

**Objetivo:** Monorepo configurado, app corriendo en simulador con Redux conectado a la API real.

**Tareas:**
```bash
# 1. Crear app Expo
npx create-expo-app Shopping_Mobile --template blank-typescript
cd Shopping_Mobile

# 2. Instalar dependencias core
npx expo install expo-router expo-secure-store expo-status-bar
npx expo install react-native-safe-area-context react-native-screens
npx expo install react-redux @reduxjs/toolkit
npm install axios

# 3. Dependencias UI
npx expo install @expo/vector-icons
npm install react-native-toast-message
npm install @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated

# 4. Dev dependencies
npm install --save-dev @types/react @types/react-native
```

**Entregable:** `npx expo start` → Expo Go en el teléfono muestra pantalla de bienvenida. Redux store inicializado. `GET /products` funciona desde el simulador.

---

### Fase 1 — Home + Catalog ✅ COMPLETADA

**Objetivo:** El usuario puede navegar el catálogo, filtrar y buscar productos.

**Pantallas:**
- `app/(tabs)/index.tsx` — FlatList de productos con `numColumns={2}`
- Filtros como `ActionSheet` o `Modal` deslizable desde abajo
- `HeroSection` adaptado (ScrollView horizontal de season cards)
- Skeleton loading (`SkeletonCard`)

**Componentes nuevos:**
- `ProductCard` — `Pressable` + `Image` (expo-image para caché) + nombre, precio, swatch dots
- `FilterSheet` — `@gorhom/bottom-sheet` con los mismos filtros que la web
- `SearchBar` — `TextInput` con debounce, filtrado local

**Estado:** Reutiliza `ProductActions.ts` + `productSlice.ts` sin cambios.

**Entregable:** Grid de productos scrollable, filtros por categoría/precio/color/talla funcionan.

---

### Fase 2 — PDP + Wishlist ✅ COMPLETADA

**Objetivo:** Ver detalle de producto, seleccionar talla/variante, añadir al carrito o wishlist.

**Pantallas:**
- `app/product/[id].tsx` — ScrollView vertical con imagen hero, swatches, size grid, CTAs
- Color tinting: `backgroundColor` con opacidad al seleccionar swatch (mismo efecto que web)
- Botón sticky de "Add to cart" en la parte inferior (fuera del ScrollView)

**Componentes nuevos:**
- `SizeGrid` — `FlatList` horizontal de `TouchableOpacity` chips
- `SwatchRow` — fila de círculos de color
- `GalleryViewer` — FlatList horizontal con `pagingEnabled`, dots indicadores

**Wishlist:**
- Reutiliza `WishesActions.ts` completo (optimistic update + revert) — cero cambios
- Icono corazón en la tab bar con badge numérico
- `app/(tabs)/wishlist.tsx` — misma lógica que `Wishlist.tsx` web

**Entregable:** PDP completa, wishlist añade/quita con feedback inmediato.

---

### Fase 3 — Auth ✅ COMPLETADA

**Objetivo:** Login, registro, sesión persistida en SecureStore.

**Pantallas:**
- `app/auth/login.tsx` — KeyboardAvoidingView + TextInput + botón login
- `app/auth/register.tsx` — campos nombre, email, contraseña
- Redirect automático post-login al origen (Expo Router `router.replace`)

**Cambio clave vs web — SecureStore:**
```ts
// utils/storage.ts
import * as SecureStore from 'expo-secure-store';

export const getItem = (key: string) => SecureStore.getItemAsync(key);
export const setItem = (key: string, value: string) => SecureStore.setItemAsync(key, value);
export const removeItem = (key: string) => SecureStore.deleteItemAsync(key);
```

**Bootstrap equivalente de `App.tsx`:**
```ts
// hooks/useBootstrap.ts
export const useBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    (async () => {
      const raw = await getItem('decodedUser');
      if (!raw) return;
      const parsed = JSON.parse(raw) as decodedUser;
      dispatch(logged(parsed));
      dispatch(getWishList(parsed.user_id));
      dispatch(fetchingAddresses(parsed.user_id));
      dispatch(fetchingPayments(parsed.user_id));
    })();
  }, []);
};
```

**Entregable:** Login/registro funcionan, sesión persiste entre reinicios de la app.

---

### Fase 4 — Cart + Checkout ✅ COMPLETADA

**Objetivo:** Añadir al carrito, gestionar cantidades, completar checkout.

**Cart:**
- `CartSheet` — `@gorhom/bottom-sheet` que sube desde abajo (equivalente al `CartDrawer` web)
- Tab bar badge con conteo de items
- `CartLineItem` — fila con imagen, nombre, stepper, precio parcial, botón remove

**Checkout:**
- `app/checkout.tsx` — `ProgressSteps` horizontal (Address → Payment → Confirm)
- Selección de dirección y pago con `RadioButton` cards
- Toggle shipping method (Standard / Express)
- Mismo endpoint `POST /orders/place` — reutiliza `CheckoutActions.ts`
- Toast de error en 409 (stock insuficiente)

**Entregable:** Flujo completo add to cart → checkout → pedido confirmado funciona en simulador.

---

### Fase 5 — Perfil + Historial ✅ COMPLETADA

**Objetivo:** Gestión de cuenta, direcciones, pagos e historial de pedidos.

**Pantallas:**
- `app/(tabs)/profile.tsx` — tab con secciones: Info personal, Direcciones, Pagos, Historial
- Formularios con `TextInput` + `KeyboardAvoidingView`
- `app/history.tsx` — FlatList de órdenes con `OrderStatusBadge`

**Componentes:**
- `OrderStatusBadge` — mismo lógica de colores/labels que la web
- `AddressCard` — card con acciones swipe (react-native-swipeable)
- `PaymentCard` — número enmascarado, provider icon

**Reutiliza:** `AddressActions.ts`, `PaymentAction.ts`, `UserAction.ts` — sin cambios.

**Entregable:** CRUD de direcciones y tarjetas funciona, historial muestra órdenes reales.

---

### Fase 6 — Admin (3–4 días)

**Objetivo:** Panel de administración con guard de rol.

**Guard:**
```ts
// app/admin/_layout.tsx
const { userFromToken } = useSelector((s: RootState) => s.userLogged);
if (userFromToken?.role !== 'ADMIN') return <Redirect href="/" />;
```

**Pantallas:**
- `app/admin/index.tsx` — Dashboard: 4 stat cards (customers, products, orders, revenue)
- `app/admin/orders.tsx` — FlatList con búsqueda + selector de status (Picker)
- `app/admin/products.tsx` — CRUD con modal de creación/edición
- `app/admin/customers.tsx` — tabla de usuarios con badge de rol

**Entregable:** Admin puede gestionar órdenes, productos y ver estadísticas desde el móvil.

---

### Fase 7 — Polish + Deploy (5–6 días)

**Objetivo:** App lista para publicar en App Store y Google Play.

**Push Notifications:**
```bash
npx expo install expo-notifications expo-device
```
- Notificación cuando un pedido cambia de estado (necesita endpoint de webhook o polling)

**App Config (`app.json`):**
```json
{
  "expo": {
    "name": "STRIDE",
    "slug": "stride-shoes",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "backgroundColor": "#000000" },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.stride.shoes"
    },
    "android": {
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" },
      "package": "com.stride.shoes"
    }
  }
}
```

**Build y deploy con EAS:**
```bash
npm install -g eas-cli
eas login
eas build:configure

# TestFlight / Internal Testing
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Production
eas build --platform all --profile production
eas submit --platform all
```

**Entregable:** `.ipa` y `.aab` generados, subidos a TestFlight y Google Play Internal Testing.

---

## Tema STRIDE en React Native

```ts
// theme/colors.ts
export const colors = {
  primary:     '#000000',
  secondary:   '#ffffff',
  action:      '#111111',
  actionHover: '#222222',
  error:       '#dc2626',
  warning:     '#f59e0b',
  success:     '#16a34a',
  bgPrimary:   '#ffffff',
  bgSecondary: '#f5f5f5',
  bgCard:      '#ffffff',
  fgPrimary:   '#111111',
  fgSecondary: '#444444',
  fgMuted:     '#888888',
  border:      '#e5e5e5',
};

// theme/spacing.ts
export const spacing = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20,
  6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
};

// theme/typography.ts
export const typography = {
  xs:   11, sm: 13, base: 15, md: 17,
  lg:   19, xl: 22, '2xl': 28, '3xl': 36,
};
```

---

## Dependencias clave

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-image": "~2.0.0",
    "expo-notifications": "~0.29.0",
    "@expo/vector-icons": "^14.0.0",
    "react-native": "0.76.x",
    "react-native-safe-area-context": "^4.12.0",
    "react-native-screens": "^4.0.0",
    "react-native-reanimated": "^3.16.0",
    "react-native-gesture-handler": "^2.20.0",
    "@gorhom/bottom-sheet": "^5.0.0",
    "react-native-toast-message": "^2.2.0",
    "react-redux": "^9.1.0",
    "@reduxjs/toolkit": "^2.3.0",
    "axios": "^1.7.0",
    "jwt-decode": "^4.0.0"
  }
}
```

---

## Timeline estimado

| Fase | Días | Semana |
|------|------|--------|
| 0 — Setup + monorepo | 3–4 | 1 |
| 1 — Home + Catalog | 5–6 | 1–2 |
| 2 — PDP + Wishlist | 4–5 | 2–3 |
| 3 — Auth | 3–4 | 3 |
| 4 — Cart + Checkout | 6–7 | 4 |
| 5 — Perfil + Historial | 4–5 | 5 |
| 6 — Admin | 3–4 | 5–6 |
| 7 — Polish + Deploy | 5–6 | 6–7 |
| **Total** | **~7 semanas** | |

---

## Criterios de éxito (Definition of Done)

- [ ] Catálogo carga productos desde la API de producción
- [ ] Login/registro funciona y sesión persiste entre reinicios
- [ ] Wishlist: añadir/quitar funciona con optimistic update
- [ ] Cart: añadir, modificar cantidad, eliminar items
- [ ] Checkout: flujo completo hasta pedido confirmado
- [ ] Historial: lista de órdenes propias con statuses
- [ ] Perfil: CRUD de direcciones y tarjetas
- [ ] Admin: cambio de status de órdenes desde el móvil
- [ ] Build de producción sin errores en iOS y Android
- [ ] App publicada en TestFlight y Google Play Internal Testing

---

## Repositorio sugerido

```
GitHub: Angel-cuba/Shopping_Mobile
Branch strategy: main (producción) / develop / feature/*
CI: EAS Build en GitHub Actions on push to main
```

---

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| `localStorage` API no disponible en RN | Seguro | Usar `expo-secure-store` desde día 1 |
| Dependencias web no compatibles con RN | Media | Revisar cada import antes de mover a `packages/shared` |
| Diferencias de comportamiento de Axios en RN | Baja | Axios es compatible; testear contra API real en Fase 0 |
| Cold start de Render tarda 30s | Seguro | Implementar loading skeleton; considerar upgrade a Render paid |
| Rechazo en App Store (política de pagos) | Media | No hay pagos reales (simulados); documentar en descripción |
