import { AnyAction } from 'redux';
import {
  ADD_TO_WISHLIST,
  GET_WISHLIST,
  REMOVE_FROM_WISHLIST,
  WishListState,
} from '../../interfaces/wishes/constants';

export const initialWishState: WishListState = {
  itemInWishlist: [],
};

export default function wishReducer(state = initialWishState, action: AnyAction) {
  switch (action.type) {
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
        itemInWishlist: [...state.itemInWishlist, action.payload],
      };
    }
    case REMOVE_FROM_WISHLIST: {
      if (state.itemInWishlist === null) {
        return state;
      }
      return {
        ...state,
        itemInWishlist: state.itemInWishlist?.filter((item) => item !== action.payload),
      };
    }
    default:
      return state;
  }
}
