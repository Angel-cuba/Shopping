import { AnyAction } from 'redux'
import { ADD_TO_CART, CLEAR_CART, CartState, REMOVE_FROM_CART } from '../../interfaces/cart/constants'

export const initialCartState: CartState = {
  itemInCart: null
}

export default function cartReducer(state = initialCartState, action: AnyAction) {
  switch (action.type) {
    case ADD_TO_CART: {
      if (state.itemInCart === null) {
        return {
          ...state,
          itemInCart: [{ ...action.payload, quantity: 1 }]
        }
      }
      const product = state.itemInCart.find((item) => item.id === action.payload.id)
      const time = new Date().getTime()
      const hasSameVariant = product?.variant === action.payload.variant
      const hasSameSize = product?.sizes === action.payload.sizes
      if (product) {
        if (!hasSameVariant && hasSameSize) {
          const newItem = { ...action.payload, id: action.payload.id + time, quantity: 1 }
          return {
            ...state,
            itemInCart: [...state.itemInCart, newItem]
          }
        }
        if (hasSameVariant && !hasSameSize) {
          const newItem = { ...action.payload, id: action.payload.id + time, quantity: 1 }
          return {
            ...state,
            itemInCart: [...state.itemInCart, newItem]
          }
        }
        if (!hasSameSize && !hasSameVariant) {
          const newItem = { ...action.payload, id: action.payload.id + time, quantity: 1 }
          return {
            ...state,
            itemInCart: [...state.itemInCart, newItem]
          }
        }
        if (hasSameVariant && hasSameSize) {
          return {
            ...state,
            itemInCart: state.itemInCart.map((item) => {
              const { id, variant, sizes, quantity } = item
              if (
                id === product.id &&
                variant === action.payload.variant &&
                sizes === action.payload.sizes
              ) {
                return { ...item, quantity: quantity ? quantity + 1 : 1 }
              }
              return item
            })
          }
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
            const { id, quantity } = item
            if (id === product.id) {
              return { ...item, quantity: quantity ? quantity - 1 : 1 }
            }
            return item
          })
        }
      }
      return state
    }
    case CLEAR_CART: {
      return {
        ...state,
        itemInCart: null
      }
    }
    default:
      return state
  }
}
