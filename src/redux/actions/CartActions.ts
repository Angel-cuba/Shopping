import { CartProduct } from '../../interfaces/cart/CartType'
import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART, REMOVE_LINE_FROM_CART } from '../../interfaces/cart/constants'

export const addToCart = (product: CartProduct) => {
  return {
    type: ADD_TO_CART,
    payload: product
  } as const
}

export const removeFromCart = (product: CartProduct) => {
  return {
    type: REMOVE_FROM_CART,
    payload: product
  } as const
}

export const removeLineFromCart = (id: string) => {
  return {
    type: REMOVE_LINE_FROM_CART,
    payload: { id },
  } as const
}

export const clearCart = () => {
  return {
    type: CLEAR_CART
  } as const
}