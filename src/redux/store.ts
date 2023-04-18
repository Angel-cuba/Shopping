import { configureStore } from '@reduxjs/toolkit'
import CartReducer from './reducers/CartReducer'
import ProductsReducer from './reducers/ProductReducer'
import { userReducer } from './reducers/UserReducer'
import WishReducer from './reducers/WishesReducer'

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    products: ProductsReducer,
    userLogged: userReducer,
    wishes: WishReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
