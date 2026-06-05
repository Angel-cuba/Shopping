import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CartReducer from '../redux/reducers/CartReducer';
import ProductsReducer from '../redux/reducers/ProductReducer';
import { userReducer } from '../redux/reducers/UserReducer';
import WishReducer from '../redux/reducers/WishesReducer';
import paymentReducer from '../redux/reducers/PaymentReducer';
import addressReducer from '../redux/reducers/AddressReducer';

export function makeStore() {
  return configureStore({
    reducer: {
      cart:       CartReducer,
      products:   ProductsReducer,
      userLogged: userReducer,
      wishes:     WishReducer,
      payments:   paymentReducer,
      addresses:  addressReducer,
    },
  });
}

export function renderWithStore(ui: React.ReactElement): RenderResult {
  return render(
    <Provider store={makeStore()}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

/** Render without Redux store — for components that only use local state + api */
export function renderWithRouter(ui: React.ReactElement): RenderResult {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}
