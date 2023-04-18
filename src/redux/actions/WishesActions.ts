import { Product } from "../../interfaces/products/ProductType"
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../interfaces/wishes/constants"

export const addToWishList = (product: Product) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: product
  } as const
}

export const removeFromWishList = (product: Product) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload: product
  } as const
}