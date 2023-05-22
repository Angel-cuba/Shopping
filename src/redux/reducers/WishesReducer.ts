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
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_WISHES:
      return {
        ...state,
        loading: false,
      };
    case REQUEST_WISHES:
      return {
        ...state,
        success: true,
      };
    case SUCCESSFUL_WISHES:
      return {
        ...state,
        success: false,
      };
    case GET_WISHLIST:
      return {
        ...state,
        itemInWishlist: action.payload,
      };
    case ADD_TO_WISHLIST: {
      if (state.itemInWishlist === null) {
        return {
          ...state,
          itemInWishlist: [action.payload],
        };
      }
      return {
        ...state,
        itemInWishlist: action.payload.userWishes,
      };
    }
    case REMOVE_FROM_WISHLIST: {
      if (state.itemInWishlist === null) {
        return state;
      }
      return {
        ...state,
        itemInWishlist: action.payload.userWishes,
      };
    }
    case CLEAR_WISHLIST:
      return {
        ...state,
        itemInWishlist: action.payload,
      };
    default:
      return state;
  }
}
