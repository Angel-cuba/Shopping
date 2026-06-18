export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  inStock: number;
  categories: Category;
  variants: Variant[];
  sizes: Size[];
  price: number;
};

export type NewProductToStock = {
  id?: string;
  name: string;
  description: string;
  image: string;
  categories: string;
  inStock: number;
  variants: string[];
  sizes: string[];
  price: number;
};

export type FashionCollection = 'Women' | 'Men' | 'Kids' | 'Accessories';

export type Category =
  | FashionCollection
  | 'Summer' | 'Winter' | 'Spring' | 'Autumn'
  | 'Running' | 'Basketball' | 'Lifestyle' | 'Training' | 'Football';

type Size = string;
type Variant = string;
export type ProductKind = 'apparel' | 'footwear' | 'accessory' | 'watch';

export const COLLECTIONS: Array<{ label: FashionCollection; value: FashionCollection }> = [
  { label: 'Women', value: 'Women' },
  { label: 'Men', value: 'Men' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Accessories', value: 'Accessories' },
];

export const Sizes = [
  'One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
];

export const Variants = [
  'Ivory', 'Black', 'Cobalt', 'Mint', 'Coral', 'Sage',
  'Denim', 'Camel', 'Blush', 'Silver', 'Gold', 'Graphite',
];

type VariantColorsType = { [key: string]: string };

export const VariantsColors: VariantColorsType = {
  Ivory: '#F8F3E8',
  Black: '#111111',
  Cobalt: '#2563EB',
  Mint: '#98FB98',
  Coral: '#FF6B6B',
  Sage: '#87A96B',
  Denim: '#3B5B7A',
  Camel: '#C19A6B',
  Blush: '#F4A6B8',
  Silver: '#C0C0C0',
  Gold: '#D4AF37',
  Graphite: '#3F3F46',
  Crimson: '#DC143C',
  Teal: '#008080',
  Aquamarine: '#7FFFD4',
  Maroon: '#800000',
  Violet: '#8B5CF6',
  Fuscia: '#FF00FF',
  Pink: '#FFC0CB',
  Goldenrod: '#DAA520',
};

const KEYWORD_COLOR: Record<string, string> = {
  black: '#111111',
  white: '#F5F5F5',
  ivory: '#F8F3E8',
  cream: '#FFF3E0',
  red: '#DC2626',
  blue: '#2563EB',
  cobalt: '#2563EB',
  green: '#16A34A',
  mint: '#98FB98',
  sage: '#87A96B',
  yellow: '#F59E0B',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  navy: '#1E3A8A',
  pink: '#F472B6',
  blush: '#F4A6B8',
  purple: '#7C3AED',
  orange: '#EA580C',
  coral: '#FF6B6B',
  brown: '#92400E',
  camel: '#C19A6B',
  denim: '#3B5B7A',
  gold: '#D4AF37',
  silver: '#C0C0C0',
  graphite: '#3F3F46',
  chrome: '#CBD5E1',
  volt: '#C8FF00',
  electric: '#B8FF00',
};

const LEGACY_COLLECTION_BY_CATEGORY: Record<string, FashionCollection> = {
  Summer: 'Women',
  Autumn: 'Men',
  Spring: 'Kids',
  Winter: 'Accessories',
};

const SPORT_CATEGORIES = ['Running', 'Basketball', 'Lifestyle', 'Training', 'Football'];
const FASHION_COLLECTION_VALUES: FashionCollection[] = ['Women', 'Men', 'Kids', 'Accessories'];

const API_ORIGIN = 'http://localhost:8080';

function nameSeed(value: string): number {
  return Array.from(value || 'zyra').reduce((acc, c) => ((acc * 31 + c.charCodeAt(0)) | 0), 0);
}

function image(url: string) {
  return `${url}?w=900&q=80&auto=format&fit=crop`;
}

const COLLECTION_IMAGES: Record<FashionCollection, string[]> = {
  Women: [
    image('https://images.unsplash.com/photo-1529139574466-a303027c1d8b'),
    image('https://images.unsplash.com/photo-1496747611176-843222e1e57c'),
    image('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'),
    image('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    image('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'),
    image('https://images.unsplash.com/photo-1483985988355-763728e1935b'),
  ],
  Men: [
    image('https://images.unsplash.com/photo-1516257984-b1b4d707412e'),
    image('https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2'),
    image('https://images.unsplash.com/photo-1523398002811-999ca8dec234'),
    image('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'),
    image('https://images.unsplash.com/photo-1487222477894-8943e31ef7b2'),
    image('https://images.unsplash.com/photo-1507680434567-5739c80be1ac'),
  ],
  Kids: [
    image('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9'),
    image('https://images.unsplash.com/photo-1529139574466-a303027c1d8b'),
    image('https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb'),
    image('https://images.unsplash.com/photo-1514090458221-65bb69cf63e6'),
    image('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'),
    image('https://images.unsplash.com/photo-1483985988355-763728e1935b'),
  ],
  Accessories: [
    image('https://images.unsplash.com/photo-1523170335258-f5ed11844a49'),
    image('https://images.unsplash.com/photo-1558769132-cb1aea458c5e'),
    image('https://images.unsplash.com/photo-1523398002811-999ca8dec234'),
    image('https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2'),
    image('https://images.unsplash.com/photo-1511499767150-a48a237f0083'),
    image('https://images.unsplash.com/photo-1542291026-7eec264c27ff'),
  ],
};

const FALLBACK_IMAGES = Object.values(COLLECTION_IMAGES).flat();

const LEGACY_SHOE_IMAGE_MARKERS = [
  'shoes',
  'air-max',
  '1542291026',
  '1606107557195',
  '1491553895911',
  '1515955656352',
  '1539185441755',
  '1552346154',
  '1587563871167',
  '1595950653106',
  '1600185365483',
];

export function isFashionCollection(value = ''): value is FashionCollection {
  return FASHION_COLLECTION_VALUES.includes(value as FashionCollection);
}

export function resolveCollection(category = '', productKey = ''): FashionCollection {
  if (isFashionCollection(category)) return category;
  if (LEGACY_COLLECTION_BY_CATEGORY[category]) return LEGACY_COLLECTION_BY_CATEGORY[category];
  if (SPORT_CATEGORIES.includes(category)) {
    const seed = Math.abs(nameSeed(`${category}:${productKey}`));
    return FASHION_COLLECTION_VALUES[seed % FASHION_COLLECTION_VALUES.length];
  }
  const seed = Math.abs(nameSeed(`${category}:${productKey}`));
  return FASHION_COLLECTION_VALUES[seed % FASHION_COLLECTION_VALUES.length];
}

export function getCollectionLabel(category = '', productKey = ''): FashionCollection {
  return resolveCollection(category, productKey);
}

export function inferProductKind(product: { name: string; categories?: string; sizes: string[] }): ProductKind {
  const name = product.name.toLowerCase();
  const category = String(product.categories ?? '');
  if (/\b(watch|reloj|chronograph|timepiece)\b/.test(name)) return 'watch';
  if (
    category === 'Accessories' ||
    /\b(bag|belt|cap|hat|sunglasses|glasses|scarf|wallet|jewelry|bracelet|ring|necklace)\b/.test(name)
  ) return 'accessory';
  if (/\b(shoe|sneaker|trainer|boot|sandal|heel|runner|air max|jordan)\b/.test(name)) return 'footwear';
  if (product.sizes.some((size) => /^\d{2}$/.test(size))) return 'footwear';
  return 'apparel';
}

export function getProductOptionConfig(product: Product) {
  const kind = inferProductKind(product);
  if (kind === 'watch') {
    return {
      kind,
      label: 'Style',
      guideLabel: 'Care guide',
      requiredMessage: 'Please select a style first',
      ctaWhenMissing: 'Pick a style',
      selectedPrefix: 'Style',
      showGuide: true,
    };
  }
  if (kind === 'accessory') {
    return {
      kind,
      label: 'Option',
      guideLabel: 'Details',
      requiredMessage: 'Please select an option first',
      ctaWhenMissing: 'Pick an option',
      selectedPrefix: 'Option',
      showGuide: false,
    };
  }
  if (kind === 'footwear') {
    return {
      kind,
      label: 'Size (EU)',
      guideLabel: 'Size guide',
      requiredMessage: 'Please select a size first',
      ctaWhenMissing: 'Pick a size',
      selectedPrefix: 'EU',
      showGuide: true,
    };
  }
  return {
    kind,
    label: 'Size',
    guideLabel: 'Size guide',
    requiredMessage: 'Please select a size first',
    ctaWhenMissing: 'Pick a size',
    selectedPrefix: 'Size',
    showGuide: true,
  };
}

export function getCartOptionSummary(item: { name: string; categories?: string; sizes?: string; variant?: string }) {
  const kind = inferProductKind({ name: item.name, categories: item.categories ?? '', sizes: item.sizes ? [item.sizes] : [] });
  const parts: string[] = [];
  if (item.sizes) {
    if (kind === 'footwear') parts.push(`EU ${item.sizes}`);
    else if (kind === 'watch') parts.push(`Style ${item.sizes}`);
    else parts.push(item.sizes === 'One Size' ? 'One size' : `Size ${item.sizes}`);
  }
  if (item.variant) parts.push(item.variant);
  return parts.join(' · ');
}

export function matchesCollection(product: Product, selectedCategory: string): boolean {
  if (!selectedCategory) return true;
  return resolveCollection(product.categories, `${product.id}:${product.name}`) === selectedCategory;
}

export function sortByCollectionAffinity(products: Product[], selectedCategory: string): Product[] {
  return [...products].sort((a, b) => {
    const aCollection = resolveCollection(a.categories, `${a.id}:${a.name}`);
    const bCollection = resolveCollection(b.categories, `${b.id}:${b.name}`);
    const aScore = aCollection === selectedCategory ? 0 : 1;
    const bScore = bCollection === selectedCategory ? 0 : 1;
    if (aScore !== bScore) return aScore - bScore;
    return Math.abs(nameSeed(`${selectedCategory}:${a.id}`)) - Math.abs(nameSeed(`${selectedCategory}:${b.id}`));
  });
}

export function getCategoryProducts(products: Product[], selectedCategory = '', minItems = 15): Product[] {
  if (!selectedCategory) return products;
  const matched = products.filter((product) => matchesCollection(product, selectedCategory));
  if (matched.length >= minItems) return matched;
  const matchedIds = new Set(matched.map((product) => product.id));
  const fillers = sortByCollectionAffinity(
    products.filter((product) => !matchedIds.has(product.id)),
    selectedCategory
  ).slice(0, Math.max(0, minItems - matched.length));
  return [...matched, ...fillers];
}

export function filterProducts(products: Product[], filters: { category?: string; size?: string; variant?: string; search?: string }, minCategoryItems = 15): Product[] {
  const categoryPool = filters.category
    ? getCategoryProducts(products, filters.category, minCategoryItems)
    : products;

  return categoryPool.filter((product) => {
    const nameOk = !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase());
    const sizeOk = !filters.size || product.sizes.includes(filters.size);
    const variantOk = !filters.variant || product.variants.includes(filters.variant);
    return nameOk && sizeOk && variantOk;
  });
}

export function getRecommendedProducts(products: Product[], product: Product, limit = 4): Product[] {
  const collection = resolveCollection(product.categories, `${product.id}:${product.name}`);
  return products
    .filter((candidate) => candidate.id !== product.id)
    .sort((a, b) => {
      const aCollection = resolveCollection(a.categories, `${a.id}:${a.name}`);
      const bCollection = resolveCollection(b.categories, `${b.id}:${b.name}`);
      const aScore = aCollection === collection ? 0 : 1;
      const bScore = bCollection === collection ? 0 : 1;
      if (aScore !== bScore) return aScore - bScore;
      return Math.abs(nameSeed(`${product.id}:${a.id}`)) - Math.abs(nameSeed(`${product.id}:${b.id}`));
    })
    .slice(0, limit);
}

function shouldIgnoreRemoteImage(url = '', category = '') {
  if (!url || url.startsWith('/')) return false;
  if (isFashionCollection(category) || Object.keys(LEGACY_COLLECTION_BY_CATEGORY).includes(category)) return false;
  return SPORT_CATEGORIES.includes(category) || LEGACY_SHOE_IMAGE_MARKERS.some((marker) => url.includes(marker));
}

export function resolveColor(variant: string): string {
  if (!variant) return '#ccc';
  if (VariantsColors[variant]) return VariantsColors[variant];
  const keywords = variant
    .toLowerCase()
    .split(/[/\s-]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  for (const keyword of keywords) {
    const match = KEYWORD_COLOR[keyword];
    if (match) return match;
    const partial = Object.keys(KEYWORD_COLOR).find((key) => keyword.startsWith(key));
    if (partial) return KEYWORD_COLOR[partial];
  }
  return '#ccc';
}

export function resolveImageUrl(url: string, productName = '', category = ''): string {
  const collection = resolveCollection(category, productName);
  if (url && url.startsWith('http') && !shouldIgnoreRemoteImage(url, category)) return url;
  if (url && url.startsWith('/') && !shouldIgnoreRemoteImage(url, category)) return `${API_ORIGIN}${url}`;
  const pool = COLLECTION_IMAGES[collection] ?? FALLBACK_IMAGES;
  const seed = Math.abs(nameSeed(productName));
  return pool[seed % pool.length];
}

export function onImgError(productName: string, category = '') {
  return (event: { currentTarget: HTMLImageElement }) => {
    event.currentTarget.src = resolveImageUrl('', productName, category);
    event.currentTarget.onerror = null;
  };
}

export function getGalleryImages(baseImage: string, productName: string, variant?: string, category = ''): string[] {
  const collection = resolveCollection(category, productName);
  const pool = COLLECTION_IMAGES[collection] ?? FALLBACK_IMAGES;
  const seed = Math.abs(nameSeed(`${productName}:${variant ?? ''}`));
  const lead = resolveImageUrl(baseImage, productName, category);
  const images = [
    lead,
    pool[(seed + 1) % pool.length],
    pool[(seed + 3) % pool.length],
    pool[(seed + 5) % pool.length],
  ];
  return Array.from(new Set(images)).slice(0, 4);
}

export function getProductInfoTabs(product: Product) {
  const collection = resolveCollection(product.categories, `${product.id}:${product.name}`);
  const kind = inferProductKind(product);
  const material =
    kind === 'watch'
      ? 'Stainless-steel finish with a polished dial, mineral glass face, and an adjustable bracelet designed for daily wear.'
      : kind === 'accessory'
        ? 'Premium mixed materials selected for daily use, soft touch, and easy maintenance.'
        : kind === 'footwear'
          ? 'Cushioned sole, breathable upper, and reinforced high-wear zones for steady everyday movement.'
          : 'Soft-touch fabric blend with a structured drape, breathable hand feel, and reinforced finishing.';
  const brand =
    kind === 'watch'
      ? 'ZYRA LUXE accessories are curated as sharp finishing pieces, built to pair cleanly with seasonal edits.'
      : 'ZYRA LUXE curates expressive essentials with fast checkout, clean sizing, and everyday styling.';
  return {
    About: product.description,
    Reviews: `Rated 4.7 by customers shopping the ${collection.toLowerCase()} edit. Most mention accurate visuals, finish quality, and easy styling.`,
    Material: material,
    Brand: brand,
  };
}
