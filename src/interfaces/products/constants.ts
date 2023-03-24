import { Product } from './ProductType'

export const GET_PRODUCTS = 'GET_PRODUCTS'

export const LOADING = 'LOADING'
export const STOP_LOADING = 'STOP_LOADING'
export const ERROR = 'ERROR'

//Action types for product
export type LoadingAction = {
  type: typeof LOADING
}
export type StopLoadingAction = {
  type: typeof STOP_LOADING
}
export type ErrorAction = {
  type: typeof ERROR
  payload: string | null
}

export type GetProductsAction = {
  type: typeof GET_PRODUCTS
  payload: Product[]
}

export type ProductActionTypes = GetProductsAction | LoadingAction | StopLoadingAction | ErrorAction

export type ProductState = {
  products: Product[]
  loading: boolean
  error: string | null
}
