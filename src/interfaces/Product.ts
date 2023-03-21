export type Product = {
  id: number
  name: string
  price: number
  description: string
  image?: string
  categories: Category
  variant: Variant
  sizes: Sizes
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
