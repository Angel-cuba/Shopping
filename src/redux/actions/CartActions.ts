import { CartProduct } from '../../interfaces/cart/CartType'
import { ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART } from '../../interfaces/cart/constants'

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

export const clearCart = () => {
  return {
    type: CLEAR_CART
  } as const
}