import { AnyAction } from 'redux';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  ERROR,
  GET_PRODUCTS,
  LOADING,
  ProductState,
  STOP_LOADING,
  UPDATE_PRODUCT,
} from '../../interfaces/products/constants';

export const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null,
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
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
