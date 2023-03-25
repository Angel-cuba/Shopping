import { AnyAction } from 'redux'
import { ADD_TO_CART, CartState, REMOVE_FROM_CART } from '../../interfaces/cart/constants'

export const initialCartState: CartState = {
  itemInCart: null
}

export default function CartReducer(state = initialCartState, action: AnyAction) {
  switch (action.type) {
    case ADD_TO_CART: {
      if (state.itemInCart === null) {
        return {
          ...state,
          itemInCart: [{ ...action.payload, quantity: 1 }]
        }
      }
      const product = state.itemInCart.find((item) => item.id === action.payload.id)
      if (product) {
        return {
          ...state,
          itemInCart: state.itemInCart.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity ? item.quantity + 1 : 1 }
            }
            return item
          })
        }
      }
      return {
        ...state,
        itemInCart: [...state.itemInCart, { ...action.payload, quantity: 1 }]
      }
    }
    case REMOVE_FROM_CART: {
      if (state.itemInCart === null) {
        return state
      }
      const product = state.itemInCart.find((item) => item.id === action.payload.id)
      if (product) {
        if (product.quantity === 1) {
          return {
            ...state,
            itemInCart: state.itemInCart.filter((item) => item.id !== product.id)
          }
        }
        return {
          ...state,
          itemInCart: state.itemInCart.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity ? item.quantity - 1 : 1 }
            }
            return item
          })
        }
      }
      return state
    }
    default:
      return state
  }
}
