import { Dispatch } from 'redux'
import { PRODUCTS } from '../../data/dummy'
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  ERROR,
  GET_PRODUCTS,
  LOADING,
  STOP_LOADING,
  UPDATE_PRODUCT
} from '../../interfaces/products/constants'
import { NewProductToStock } from '../../interfaces/products/ProductType'

export const getProducts = () => {
  return {
    type: GET_PRODUCTS,
    payload: PRODUCTS
  } as const
}

export const addProduct = (product: NewProductToStock) => {
  return {
    type: ADD_PRODUCT,
    payload: product
  } as const
}

export const updateProduct = (product: NewProductToStock) => {
  return {
    type: UPDATE_PRODUCT,
    payload: product
  } as const
}

export const deleteProduct = (id: string) => {
  return {
    type: DELETE_PRODUCT,
    payload: id
  } as const
}

export const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING })
      dispatch(getProducts())
    } catch (error) {
      dispatch({ type: ERROR, payload: error })
    }
    dispatch({ type: STOP_LOADING })
  }
}

export const addProductToStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING })
      console.log('addProductToStock', product)
      dispatch(addProduct(product))
    } catch (error) {
      dispatch({ type: ERROR, payload: error })
    }
    dispatch({ type: STOP_LOADING })
  }
}

export const updateProductInStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING })
      dispatch(updateProduct(product))
    } catch (error) {
      dispatch({ type: ERROR, payload: error })
    }
    dispatch({ type: STOP_LOADING })
  }
}

export const deleteProductFromStock = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING })
      dispatch(deleteProduct(id))
    } catch (error) {
      dispatch({ type: ERROR, payload: error })
    }
    dispatch({ type: STOP_LOADING })
  }
}

export type ProductActions =
  | ReturnType<typeof getProducts>
  | ReturnType<typeof addProduct>
  | ReturnType<typeof updateProduct>
  | ReturnType<typeof deleteProduct>
