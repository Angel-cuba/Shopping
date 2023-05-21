import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../interfaces/wishes/constants"

export const addToWishList = (productId: string) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: productId
  } as const
}

export const removeFromWishList = (productId: string) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload: productId
  } as const
}