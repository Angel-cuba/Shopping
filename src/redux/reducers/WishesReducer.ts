import { AnyAction } from 'redux';
import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  WishListState,
} from '../../interfaces/wishes/constants';

export const initialWishState: WishListState = {
  itemInWishlist: null,
};

export default function wishReducer(state = initialWishState, action: AnyAction) {
  switch (action.type) {
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
