import { AnyAction } from 'redux';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  ERROR,
  FAILURE,
  GET_PRODUCTS,
  LOADING,
  ProductState,
  REQUEST,
  STOP_LOADING,
  SUCCESSFUL,
  UPDATE_PRODUCT,
} from '../../interfaces/products/constants';

export const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null,
  success: false
};

export default function productReducer(state = initialProductState, action: AnyAction) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case ADD_PRODUCT: {
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    }
    case UPDATE_PRODUCT: {
      const products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
      return {
        ...state,
        products
      };
    }
    case DELETE_PRODUCT: {
      const removedProduct = state.products.filter((product) => product.id !== action.payload);
      return {
        ...state,
        products: removedProduct,
      };
    }
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case REQUEST: 
      return {
        ...state,
        success: true
      }
    case SUCCESSFUL: 
      return {
        ...state,
        success: false
      }
    case FAILURE: 
      return {
        ...state,
        success: false
      }
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
