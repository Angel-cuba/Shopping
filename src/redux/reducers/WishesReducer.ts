import { AnyAction } from 'redux';
import {
  ADD_TO_WISHLIST,
  CLEAR_WISHLIST,
  GET_WISHLIST,
  LOADING_WISHES,
  REMOVE_FROM_WISHLIST,
  REQUEST_WISHES,
  STOP_LOADING_WISHES,
  SUCCESSFUL_WISHES,
  WishListState,
} from '../../interfaces/wishes/constants';

export const initialWishState: WishListState = {
  itemInWishlist: [],
  loadingWishes: false,
  errorWishes: null,
  successWishes: false,
};

export default function wishReducer(state = initialWishState, action: AnyAction) {
  switch (action.type) {
    case LOADING_WISHES:
      return { ...state, loadingWishes: true };
    case STOP_LOADING_WISHES:
      return { ...state, loadingWishes: false };
    case REQUEST_WISHES:
      return { ...state, successWishes: true };
    case SUCCESSFUL_WISHES:
      return { ...state, successWishes: false };
    case GET_WISHLIST:
      return {
        ...state,
        itemInWishlist: action.payload,
      };
    case ADD_TO_WISHLIST: {
      const current = state.itemInWishlist ?? [];
      // API response shape: { userWishes: string[] }
      if (action.payload && typeof action.payload === 'object' && action.payload.userWishes) {
        return { ...state, itemInWishlist: action.payload.userWishes };
      }
      // Local optimistic: payload is just a product ID string
      if (typeof action.payload === 'string') {
        return {
          ...state,
          itemInWishlist: current.includes(action.payload) ? current : [...current, action.payload],
        };
      }
      return state;
    }
    case REMOVE_FROM_WISHLIST: {
      if (state.itemInWishlist === null) return state;
      // API response shape: { userWishes: string[] }
      if (action.payload && typeof action.payload === 'object' && action.payload.userWishes) {
        return { ...state, itemInWishlist: action.payload.userWishes };
      }
      // Local optimistic: payload is just a product ID string
      if (typeof action.payload === 'string') {
        return { ...state, itemInWishlist: state.itemInWishlist.filter((id) => id !== action.payload) };
      }
      return state;
    }
    case CLEAR_WISHLIST:
      return { ...state, itemInWishlist: [] };
    default:
      return state;
  }
}
