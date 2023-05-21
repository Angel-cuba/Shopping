export const GET_WISHLIST = 'GET_WISHLIST'
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const ADD_TO_WISHLIST_SUCCESS = 'ADD_TO_WISHLIST_SUCCESS'
export const ADD_TO_WISHLIST_FAILURE = 'ADD_TO_WISHLIST_FAILURE'
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST'
export const CLEAR_WISHLIST = 'CLEAR_WISHLIST'


export type GetWishlistAction = {
  type: typeof GET_WISHLIST
  payload: string[]
}

export type AddToWishlistAction = {
  type: typeof ADD_TO_WISHLIST
  payload: string
}

export type RemoveFromWishlistAction = {
  type: typeof REMOVE_FROM_WISHLIST
  payload: string
}

export type WishlistActionTypes = AddToWishlistAction | RemoveFromWishlistAction

export type WishListState = {
  itemInWishlist: string[] | null
}