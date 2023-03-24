import { legacy_createStore as createStore, applyMiddleware } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { CartState } from '../interfaces/cart/constants'
import { ProductState } from '../interfaces/products/constants'
import { initialCartState } from './reducers/CartReducer'
import { initialProductState } from './reducers/ProductReducer'
import { rootReducers } from './reducers'

export type RootState = {
  cart: CartState
  products: ProductState
}
const rootState: RootState = {
  cart: initialCartState,
  products: initialProductState
}

export const store = createStore(rootReducers, rootState, applyMiddleware(thunk))
export type AppDispatch = typeof store.dispatch
