export const GET_WISHLIST = 'GET_WISHLIST'
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const GET_WISHLIST_REQUEST = 'GET_WISHLIST_REQUEST'
export const ADD_TO_WISHLIST_SUCCESS = 'ADD_TO_WISHLIST_SUCCESS'
export const ADD_TO_WISHLIST_FAILURE = 'ADD_TO_WISHLIST_FAILURE'
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST'
export const CLEAR_WISHLIST = 'CLEAR_WISHLIST'

export const LOADING_WISHES = 'LOADING_WISHES'
export const STOP_LOADING_WISHES  = 'STOP_LOADING_WISHES'
export const REQUEST_WISHES = 'REQUEST_WISHES'
export const SUCCESSFUL_WISHES = 'SUCCESSFUL_WISHES'
export const FAILURE_WISHES = 'FAILURE_WISHES'
export const ERROR_WISHES = 'ERROR_WISHES'

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
  itemInWishlist: string[] | null,
  loadingWishes: boolean,
  errorWishes: string | null,
  successWishes: boolean
}