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

export type Category =
  | 'Summer' | 'Winter' | 'Spring' | 'Autumn'
  | 'Running' | 'Basketball' | 'Lifestyle' | 'Training' | 'Football';

type Size = string;

type Variant = string;

// EU shoe sizes displayed in the PDP size grid
export const Sizes = [
  '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47',
];

export const Variants = [
  'Crimson', 'Teal', 'Aquamarine', 'Maroon',
  'Violet', 'Fuscia', 'Pink', 'Goldenrod',
];

type VariantColorsType = { [key: string]: string };

// Single-word legacy variants
export const VariantsColors: VariantColorsType = {
  Crimson:    '#dc143c',
  Teal:       '#008080',
  Aquamarine: '#7fffd4',
  Maroon:     '#800000',
  Violet:     '#8b5cf6',
  Fuscia:     '#ff00ff',
  Pink:       '#ffc0cb',
  Goldenrod:  '#daa520',
};

// Keyword → CSS hex map for compound color names like "Black/Red" or "Electric Blue"
const KEYWORD_COLOR: Record<string, string> = {
  black:       '#111111',
  white:       '#F5F5F5',
  red:         '#DC2626',
  blue:        '#2563EB',
  green:       '#16A34A',
  yellow:      '#F59E0B',
  grey:        '#9CA3AF',
  gray:        '#9CA3AF',
  navy:        '#1E3A8A',
  pink:        '#F472B6',
  purple:      '#7C3AED',
  orange:      '#EA580C',
  brown:       '#92400E',
  gold:        '#F59E0B',
  silver:      '#C0C0C0',
  volt:        '#C8FF00',
  infrared:    '#FF3A20',
  wheat:       '#F5DEB3',
  tan:         '#D2B48C',
  pale:        '#FFF3E0',
  wolf:        '#888888',
  barely:      '#FFF3E0',
  electric:    '#00B4D8',
  aquarius:    '#00B4D8',
  mint:        '#98FB98',
  summit:      '#F8FAFC',
  triple:      '#111111',
  panda:       '#F5F5F5',
  university:  '#DC143C',
  chrome:      '#CBD5E1',
  photon:      '#F3E8FF',
  violet:      '#8B5CF6',
  california:  '#F97316',
  tahitian:    '#0D9488',
  chicago:     '#DC143C',
  royal:       '#1D4ED8',
  bred:        '#DC2626',
  coral:       '#FF6B6B',
  laser:       '#F97316',
  fossil:      '#9CA3AF',
  phantom:     '#374151',
  cosmic:      '#4C1D95',
  arctic:      '#BAE6FD',
  hyper:       '#FF0080',
  vivid:       '#FF6B00',
};

/** Resolve any variant name (single word or compound like "Black/Red") to a CSS colour. */
export function resolveColor(variant: string): string {
  if (!variant) return '#ccc';
  // Direct match first
  if (VariantsColors[variant]) return VariantsColors[variant];
  // Split on "/" or space, take first meaningful keyword
  const keywords = variant
    .toLowerCase()
    .split(/[/\s]+/)
    .map((k) => k.trim())
    .filter(Boolean);
  for (const kw of keywords) {
    const match = KEYWORD_COLOR[kw];
    if (match) return match;
    // Partial match (e.g. "blackout" → "black")
    const partial = Object.keys(KEYWORD_COLOR).find((k) => kw.startsWith(k));
    if (partial) return KEYWORD_COLOR[partial];
  }
  return '#ccc';
}

// Fallback shoe images (Unsplash, royalty-free)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556906781-9a412961a28a?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543291239-ab7a4a099ac8?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612015496289-1e1fe89fb9d6?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80&auto=format&fit=crop',
];

// Season-appropriate shoe images for each collection
const SEASON_IMAGES: Record<string, string[]> = {
  Summer: [
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556906781-9a412961a28a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80&auto=format&fit=crop',
  ],
  Winter: [
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543291239-ab7a4a099ac8?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop',
  ],
  Spring: [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612015496289-1e1fe89fb9d6?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80&auto=format&fit=crop',
  ],
  Autumn: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543291239-ab7a4a099ac8?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
  ],
};

// 4 distinct gallery images per variant color for the PDP
const VARIANT_GALLERY: Record<string, string[]> = {
  Crimson: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80&auto=format&fit=crop',
  ],
  Teal: [
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80&auto=format&fit=crop',
  ],
  Aquamarine: [
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
  ],
  Maroon: [
    'https://images.unsplash.com/photo-1543291239-ab7a4a099ac8?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80&auto=format&fit=crop',
  ],
  Violet: [
    'https://images.unsplash.com/photo-1612015496289-1e1fe89fb9d6?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop',
  ],
  Fuscia: [
    'https://images.unsplash.com/photo-1612015496289-1e1fe89fb9d6?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556906781-9a412961a28a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  ],
  Pink: [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612015496289-1e1fe89fb9d6?w=600&q=80&auto=format&fit=crop',
  ],
  Goldenrod: [
    'https://images.unsplash.com/photo-1556906781-9a412961a28a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80&auto=format&fit=crop',
  ],
};

const API_ORIGIN = 'http://localhost:8080';

// Better hash: distributes product names more evenly across the fallback pool
function nameSeed(name: string): number {
  return Array.from(name).reduce((acc, c) => ((acc * 31 + c.charCodeAt(0)) | 0), 0);
}

/** Resolve a product image URL — handles relative backend paths and provides fallback. */
export function resolveImageUrl(url: string, productName = '', category = ''): string {
  if (url && url.startsWith('http')) return url;
  if (url && url.startsWith('/')) return `${API_ORIGIN}${url}`;
  const pool = SEASON_IMAGES[category] ?? FALLBACK_IMAGES;
  const seed = Math.abs(nameSeed(productName));
  return pool[seed % pool.length];
}

/** onError handler to swap a broken image for a season-appropriate fallback. */
export function onImgError(productName: string, category = '') {
  return (e: { currentTarget: HTMLImageElement }) => {
    const pool = SEASON_IMAGES[category] ?? FALLBACK_IMAGES;
    const seed = Math.abs(nameSeed(productName));
    e.currentTarget.src = pool[seed % pool.length];
    e.currentTarget.onerror = null;
  };
}

/**
 * Returns 4 gallery images for the PDP.
 * When a variant is selected its dedicated 4-image set is returned so the
 * gallery visually changes when the user picks a colour.
 * Without a variant the real product image leads, followed by 3 distinct fallbacks.
 */
export function getGalleryImages(baseImage: string, productName: string, variant?: string): string[] {
  if (variant && VARIANT_GALLERY[variant]) {
    return VARIANT_GALLERY[variant];
  }
  const resolved = resolveImageUrl(baseImage, productName);
  const seed = Math.abs(nameSeed(productName));
  const n = FALLBACK_IMAGES.length;
  return [
    resolved,
    FALLBACK_IMAGES[(seed + 2) % n],
    FALLBACK_IMAGES[(seed + 5) % n],
    FALLBACK_IMAGES[(seed + 8) % n],
  ];
}
