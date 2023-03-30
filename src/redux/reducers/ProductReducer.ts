import { AnyAction } from 'redux'
import {
  ERROR,
  GET_PRODUCTS,
  LOADING,
  STOP_LOADING,
  ProductState,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from '../../interfaces/products/constants'

export const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null
}

export default function ProductReducer(state = initialProductState, action: AnyAction) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      }
    case ADD_PRODUCT: {
      return {
        ...state,
        products: [action.payload, ...state.products]
      }
    }
    case UPDATE_PRODUCT: {
      return {
        ...state,
        products: state.products.map((product) => {
          if (product.id === action.payload.id) {
            return action.payload
          }
          return product
        })
      }
    }
    case DELETE_PRODUCT: {
      const removedProduct = state.products.filter((product) => {
        if (product.id !== action.payload) {
          return product
        }
      })
      return {
        ...state,
        products: removedProduct
      }
    }
    case LOADING:
      return {
        ...state,
        loading: true
      }
    case STOP_LOADING:
      return {
        ...state,
        loading: false
      }
    case ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}
