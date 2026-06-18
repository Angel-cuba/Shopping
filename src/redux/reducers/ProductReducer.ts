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

const sanitizeError = (error: unknown): string | null => {
  if (error === null || typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message ?? 'Request failed');
  }
  return 'Request failed';
};

export default function productReducer(state = initialProductState, action: AnyAction) {
  const safeState = state.error === null || typeof state.error === 'string'
    ? state
    : { ...state, error: sanitizeError(state.error) };

  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...safeState,
        products: action.payload,
        error: null,
      };
    case ADD_PRODUCT: {
      return {
        ...safeState,
        products: [action.payload, ...safeState.products],
      };
    }
    case UPDATE_PRODUCT: {
      const products = safeState.products.map((product) => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
      return {
        ...safeState,
        products
      };
    }
    case DELETE_PRODUCT: {
      const removedProduct = safeState.products.filter((product) => product.id !== action.payload);
      return {
        ...safeState,
        products: removedProduct,
      };
    }
    case LOADING:
      return {
        ...safeState,
        loading: true,
        error: null,
      };
    case STOP_LOADING:
      return {
        ...safeState,
        loading: false,
      };
    case REQUEST: 
      return {
        ...safeState,
        success: true
      }
    case SUCCESSFUL: 
      return {
        ...safeState,
        success: false
      }
    case FAILURE: 
      return {
        ...safeState,
        success: false
      }
    case ERROR:
      return {
        ...safeState,
        error: sanitizeError(action.payload),
      };
    default:
      return safeState;
  }
}
