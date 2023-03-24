import {
  ERROR,
  GET_PRODUCTS,
  LOADING,
  STOP_LOADING,
  ProductActionTypes,
  ProductState
} from '../../interfaces/products/constants'

export const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null
}

export default function ProductReducer(state = initialProductState, action: ProductActionTypes) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload
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
