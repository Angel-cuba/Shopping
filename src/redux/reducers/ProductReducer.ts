import {
  ERROR,
  GET_PRODUCTS,
  LOADING,
  STOP_LOADING,
  ProductActionTypes
} from '../../interfaces/products/constants'
import { Product } from '../../interfaces/products/ProductType'

type ProductState = {
  products: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null
}

export default function ProductReducer(state = initialState, action: ProductActionTypes) {
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
