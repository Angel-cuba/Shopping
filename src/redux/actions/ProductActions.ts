import { Dispatch } from 'redux'
import { PRODUCTS } from '../../data/dummy'
import { GET_PRODUCTS, LOADING, STOP_LOADING } from '../../interfaces/constants'

export const getProducts = () => {
  return {
    type: GET_PRODUCTS,
    payload: PRODUCTS
  } as const
}

export const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING })
      dispatch(getProducts())
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error })
    }
    dispatch({ type: STOP_LOADING })
  }
}
