/* STRIDE — mock data layer (shared on window) */

const VARIANT_COLORS = {
  Crimson: '#dc143c', Teal: '#008080', Aquamarine: '#7fffd4', Maroon: '#800000',
  Violet: '#ee82ee', Fuscia: '#ff00ff', Pink: '#ffc0cb', Goldenrod: '#daa520',
};

const ALL_SIZES = ['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
const CATEGORIES = ['Summer','Winter','Spring','Autumn'];

// helper to build a product
let _pid = 0;
function P(name, cat, price, stock, variants, sizes, desc, tag) {
  _pid++;
  return {
    id: 'p' + _pid,
    name, categories: cat, price, inStock: stock,
    variants, sizes,
    description: desc,
    tag: tag || null, // 'new' | 'sale' | null
    slot: 'prod-' + _pid, // image-slot id (stable across views)
  };
}

const PRODUCTS = [
  P('Air Force Classic', 'Summer', 89.99, 45, ['Crimson','Teal','Aquamarine'], ['7','7.5','8','8.5','9','9.5','10','11'],
    'A timeless silhouette rebuilt with breathable mesh and a cushioned footbed for all-day comfort.', 'new'),
  P('Trail Runner Pro', 'Autumn', 124.99, 8, ['Maroon','Goldenrod','Teal'], ['6','7','8','9','10','11','12'],
    'Grippy lugged outsole and weatherproof upper engineered for unpredictable terrain.', null),
  P('Cloud Knit Low', 'Spring', 74.99, 120, ['Pink','Aquamarine','Violet'], ['5','5.5','6','7','8','9','10'],
    'Featherweight knit upper that moves with your foot. Designed for the everyday city stride.', 'sale'),
  P('Winter Boot Pro', 'Winter', 159.99, 4, ['Maroon','Goldenrod'], ['8','9','10','11','12'],
    'Fully insulated, fleece-lined boot with a sealed seam construction to keep the cold out.', null),
  P('Court Legacy', 'Summer', 99.99, 62, ['Crimson','Teal','Violet','Pink'], ['6','7','8','9','10','11'],
    'Heritage court styling with a premium leather overlay and a clean vulcanised sole.', 'new'),
  P('Glide Marathon', 'Spring', 139.99, 33, ['Aquamarine','Goldenrod'], ['7','8','9','10','11','12'],
    'Energy-return foam and a rocker geometry that propels you forward, mile after mile.', null),
  P('Suede Lounge', 'Autumn', 84.99, 0, ['Maroon','Goldenrod','Crimson'], ['6','7','8','9','10'],
    'Soft brushed suede and a moulded heel cup for a relaxed, supportive fit off the clock.', null),
  P('Pulse Trainer', 'Summer', 109.99, 14, ['Teal','Violet','Fuscia'], ['5.5','6','7','8','9','10','11'],
    'A versatile cross-trainer with a stable base and responsive cushioning for the gym floor.', null),
  P('Frost Hiker GTX', 'Winter', 174.99, 27, ['Maroon','Teal'], ['8','9','10','11','12'],
    'Waterproof membrane and an aggressive grip pattern made for snow-packed switchbacks.', 'new'),
  P('Breeze Slip-On', 'Summer', 64.99, 88, ['Pink','Aquamarine','Goldenrod','Violet'], ['5','6','7','8','9','10'],
    'Laceless, airy and ready in seconds. The warm-weather staple you reach for daily.', 'sale'),
  P('Velocity Elite', 'Spring', 189.99, 19, ['Crimson','Goldenrod'], ['7','8','9','10','11','12'],
    'Carbon-infused plate and a race-day foam for athletes chasing a personal best.', null),
  P('Heritage Canvas', 'Autumn', 59.99, 140, ['Maroon','Teal','Crimson','Pink'], ['5','6','7','8','9','10','11'],
    'Durable cotton canvas with a cushioned insole — a low-key classic that goes with anything.', null),
];

const RELATED = (id) => PRODUCTS.filter(p => p.id !== id).slice(0, 4);

// Orders (history + admin)
const ORDERS = [
  { id: 'ORD-2026-018', date: '1 Jun 2026', total: 179.98, status: 'shipped', customer: 'You', items: [
    { slot: PRODUCTS[0].slot, name: 'Air Force Classic', size: '9', variant: 'Crimson', qty: 1, price: 89.99 },
    { slot: PRODUCTS[4].slot, name: 'Court Legacy', size: '10', variant: 'Teal', qty: 1, price: 99.99 },
  ]},
  { id: 'ORD-2026-012', date: '15 May 2026', total: 92.98, status: 'delivered', customer: 'You', items: [
    { slot: PRODUCTS[0].slot, name: 'Air Force Classic', size: '9', variant: 'Crimson', qty: 1, price: 89.99 },
  ]},
  { id: 'ORD-2026-007', date: '28 Apr 2026', total: 74.99, status: 'delivered', customer: 'You', items: [
    { slot: PRODUCTS[2].slot, name: 'Cloud Knit Low', size: '8', variant: 'Pink', qty: 1, price: 74.99 },
  ]},
  { id: 'ORD-2026-003', date: '12 Apr 2026', total: 124.99, status: 'cancelled', customer: 'You', items: [
    { slot: PRODUCTS[1].slot, name: 'Trail Runner Pro', size: '10', variant: 'Maroon', qty: 1, price: 124.99 },
  ]},
];

const ADMIN_ORDERS = [
  { id: '#ORD-018', customer: 'John Doe', email: 'john@example.com', total: 179.98, date: '1 Jun 2026', status: 'pending' },
  { id: '#ORD-017', customer: 'Jane Smith', email: 'jane@example.com', total: 159.99, date: '31 May 2026', status: 'shipped' },
  { id: '#ORD-016', customer: 'Marco Rossi', email: 'marco@example.com', total: 64.99, date: '30 May 2026', status: 'delivered' },
  { id: '#ORD-015', customer: 'Aïcha Benali', email: 'aicha@example.com', total: 314.98, date: '29 May 2026', status: 'pending' },
  { id: '#ORD-014', customer: 'Liam Murphy', email: 'liam@example.com', total: 99.99, date: '28 May 2026', status: 'shipped' },
  { id: '#ORD-013', customer: 'Sofia García', email: 'sofia@example.com', total: 189.99, date: '27 May 2026', status: 'delivered' },
];

const CUSTOMERS = [
  { name: 'John Doe', username: 'johndoe', email: 'john@example.com', role: 'USER', orders: 12 },
  { name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', role: 'USER', orders: 8 },
  { name: 'Marco Rossi', username: 'marcor', email: 'marco@example.com', role: 'USER', orders: 3 },
  { name: 'Aïcha Benali', username: 'aichab', email: 'aicha@example.com', role: 'ADMIN', orders: 21 },
  { name: 'Liam Murphy', username: 'liamm', email: 'liam@example.com', role: 'USER', orders: 1 },
  { name: 'Sofia García', username: 'sofiag', email: 'sofia@example.com', role: 'USER', orders: 6 },
];

const ADDRESSES = [
  { id: 'a1', address: '12 Rue de la Liberté', city: 'Casablanca', postalCode: '20250', country: 'Morocco', isDefault: true },
  { id: 'a2', address: '45 Avenue Hassan II', city: 'Rabat', postalCode: '10000', country: 'Morocco', isDefault: false },
];

const PAYMENTS = [
  { id: 'pm1', provider: 'visa', holder: 'John Doe', last4: '4242', exp: '12/27' },
  { id: 'pm2', provider: 'mastercard', holder: 'John Doe', last4: '9999', exp: '04/26' },
];

const USER = { username: 'johndoe', firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '+212 600 123 456', role: 'USER' };

// stock helpers
function stockTier(n){
  if (n === 0) return 'out';
  if (n < 5) return 'low';
  if (n < 20) return 'warn';
  return 'ok';
}
function stockBadge(n){
  if (n === 0) return { cls:'badge--out', text:'Sold out' };
  if (n < 5)  return { cls:'badge--low', text:`Only ${n} left` };
  if (n < 11) return { cls:'badge--low', text:'Last units' };
  return null;
}

Object.assign(window, {
  VARIANT_COLORS, ALL_SIZES, CATEGORIES, PRODUCTS, RELATED,
  ORDERS, ADMIN_ORDERS, CUSTOMERS, ADDRESSES, PAYMENTS, USER,
  stockTier, stockBadge,
});
