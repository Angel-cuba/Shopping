export type Product = {
  id: number
  name: string
  price: number
  description: string
  image: string
  categories: Category
  variant: Variant
  sizes: Sizes
}

export type NewProduct = {
  id: number
  name: string
  price: number
  description: string
  image: string
  categories: string
  variant: string
  sizes: string
}

export type NewProductToStock = {
  id?: number
  name: string
  description: string
  image: string
  categories: string
  variant: string
  sizes: string
  price: number
}

type Category =
  | 'Granite Surfaces'
  | 'Waterproofing & Caulking'
  | 'Marlite Panels (FED)'
  | 'Casework'
  | 'Electrical'
  | 'Wall Protection'

type Sizes = 'S' | 'M' | 'L' | 'XS' | 'XL' | '2XL' | '3XL'

type Variant =
  | 'Crimson'
  | 'Teal'
  | 'Aquamarine'
  | 'Maroon'
  | 'Violet'
  | 'Fuscia'
  | 'Pink'
  | 'Goldenrod'

export const Sizes = ['S', 'M', 'L', 'XS', 'XL', '2XL', '3XL']
export const Variants = [
  'Crimson',
  'Teal',
  'Aquamarine',
  'Maroon',
  'Violet',
  'Fuscia',
  'Pink',
  'Goldenrod'
]
type VariantColorsType = {
  [key: string]: string
}
export const VariantsColors: VariantColorsType = {
  Crimson: '#dc143c',
  Teal: '#008080',
  Aquamarine: '#7fffd4',
  Maroon: '#800000',
  Violet: '#ee82ee',
  Fuscia: '#ff00ff',
  Pink: '#ffc0cb',
  Goldenrod: '#daa520'
}
