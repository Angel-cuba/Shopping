import {
  ADD_TO_CART,
  CartActionTypes,
  CartState,
  REMOVE_FROM_CART
} from '../../interfaces/cart/constants'

export const initialCartState: CartState = {
  itemInCart: null
}

export default function CartReducer(state = initialCartState, action: CartActionTypes) {
  switch (action.type) {
    case ADD_TO_CART: {
      return {
        ...state,
        cart: action.payload
      }
    }
    case REMOVE_FROM_CART: {
      return {
        ...state,
        cart: action.payload
      }
    }
    default:
      return state
  }
}
