import { configureStore } from '@reduxjs/toolkit';
import CartReducer from '../src/redux/reducers/CartReducer';
import ProductsReducer from '../src/redux/reducers/ProductReducer';
import { userReducer } from '../src/redux/reducers/UserReducer';
import WishReducer from '../src/redux/reducers/WishesReducer';
import paymentReducer from '../src/redux/reducers/PaymentReducer';
import addressReducer from '../src/redux/reducers/AddressReducer';

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    products: ProductsReducer,
    userLogged: userReducer,
    wishes: WishReducer,
    payments: paymentReducer,
    addresses: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
