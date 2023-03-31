import { CartProduct } from './CartType'

export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

export type AddToCartAction = {
  type: typeof ADD_TO_CART
  payload: CartProduct
}

export type RemoveFromCartAction = {
  type: typeof REMOVE_FROM_CART
  payload: CartProduct
}

export type CartActionTypes = AddToCartAction | RemoveFromCartAction

export type CartState = {
  itemInCart: CartProduct[] | null
}
