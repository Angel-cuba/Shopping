import { CartProduct } from './CartType'

export const ADD_TO_CART           = 'ADD_TO_CART'
export const REMOVE_FROM_CART      = 'REMOVE_FROM_CART'
export const REMOVE_LINE_FROM_CART = 'REMOVE_LINE_FROM_CART'
export const CLEAR_CART            = 'CLEAR_CART'

export type AddToCartAction = {
  type: typeof ADD_TO_CART
  payload: CartProduct
}

export type RemoveFromCartAction = {
  type: typeof REMOVE_FROM_CART
  payload: CartProduct
}

export type RemoveLineFromCartAction = {
  type: typeof REMOVE_LINE_FROM_CART
  payload: { id: string }
}

export type CartActionTypes = AddToCartAction | RemoveFromCartAction | RemoveLineFromCartAction

export type CartState = {
  itemInCart: CartProduct[] | null
}
