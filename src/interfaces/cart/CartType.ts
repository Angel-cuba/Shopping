export type CartProduct = {
  id: number | string
  name: string
  price: number
  description: string
  image: string
  categories: string
  variant: string | undefined
  sizes: string | undefined
  quantity?: number
}
