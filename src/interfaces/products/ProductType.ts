export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  categories: Category;
  variant: Variant;
  sizes: Size[] 
  price: number;
};

export type NewProductToStock = {
  id: number;
  name: string;
  description: string;
  image: string;
  categories: string;
  variant: string;
  sizes: string[];
  price: number;
};

type Category = 'Summer' | 'Winter' | 'Spring' | 'Autumn';

type Size =
  | '5'
  | '5.5'
  | '6'
  | '6.5'
  | '7'
  | '7.5'
  | '8'
  | '8.5'
  | '9'
  | '9.5'
  | '10'
  | '10.5'
  | '11'
  | '11.5'
  | '12';

type Variant =
  | 'Crimson'
  | 'Teal'
  | 'Aquamarine'
  | 'Maroon'
  | 'Violet'
  | 'Fuscia'
  | 'Pink'
  | 'Goldenrod';

export const Sizes = [
  '5',
  '5.5',
  '6',
  '6.5',
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '9.5',
  '10',
  '10.5',
  '11',
  '11.5',
  '12',
];
export const Variants = [
  'Crimson',
  'Teal',
  'Aquamarine',
  'Maroon',
  'Violet',
  'Fuscia',
  'Pink',
  'Goldenrod',
];
type VariantColorsType = {
  [key: string]: string;
};
export const VariantsColors: VariantColorsType = {
  Crimson: '#dc143c',
  Teal: '#008080',
  Aquamarine: '#7fffd4',
  Maroon: '#800000',
  Violet: '#ee82ee',
  Fuscia: '#ff00ff',
  Pink: '#ffc0cb',
  Goldenrod: '#daa520',
};
