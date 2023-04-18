import { Product } from "../products/ProductType"


export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST'

export type AddToWishlistAction = {
  type: typeof ADD_TO_WISHLIST
  payload: Product
}

export type RemoveFromWishlistAction = {
  type: typeof REMOVE_FROM_WISHLIST
  payload: Product
}

export type WishlistActionTypes = AddToWishlistAction | RemoveFromWishlistAction

export type WishListState = {
  itemInWishlist: Product[] | null
}