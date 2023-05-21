import { Dispatch } from "redux"
import { Wishes } from "../../interfaces/wishes/WishesType"
import { ADD_TO_WISHLIST, GET_WISHLIST, REMOVE_FROM_WISHLIST } from "../../interfaces/wishes/constants"
import { api } from '../../utils/api';

export const getWishes = (wishesList: Wishes) => {
  return {
    type: GET_WISHLIST,
    payload: wishesList
  } as const
}

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

export const getWishList = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.get(`/wishes/user/${id}`)
      dispatch(getWishes(response.data[0].userWishes))
    } catch (error) {
      console.log(error)
    }
  }
}