import { combineReducers } from 'redux'
import cart from './CartReducer'
import products from './ProductReducer'

export const rootReducers = combineReducers({
  products,
  cart
})
