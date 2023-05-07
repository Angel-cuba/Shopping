import { Dispatch } from 'redux';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  ERROR,
  GET_PRODUCTS,
  LOADING,
  STOP_LOADING,
  UPDATE_PRODUCT,
} from '../../interfaces/products/constants';
import { NewProductToStock, Product } from '../../interfaces/products/ProductType';

export const getProducts = (products: Product) => {
  return {
    type: GET_PRODUCTS,
    payload: products,
  } as const;
};

export const addProduct = (product: NewProductToStock) => {
  return {
    type: ADD_PRODUCT,
    payload: product,
  } as const;
};

export const updateProduct = (product: NewProductToStock) => {
  return {
    type: UPDATE_PRODUCT,
    payload: product,
  } as const;
};

export const deleteProduct = (id: string) => {
  return {
    type: DELETE_PRODUCT,
    payload: id,
  } as const;
};

export const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    try {
      const request = await fetch('http://localhost:8080/api/v1/products');
      const response = await request.json();
      dispatch({ type: LOADING });
      dispatch(getProducts(response));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const addProductToStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    };
    try {
      dispatch({ type: LOADING });
      await fetch('http://localhost:8080/api/v1/products', option)
        .then((response) => response.json())
        .then((data) => console.log('server response', data));
      dispatch(addProduct(product));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const updateProductInStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING });
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const deleteProductFromStock = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING });
      dispatch(deleteProduct(id));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export type ProductActions =
  | ReturnType<typeof getProducts>
  | ReturnType<typeof addProduct>
  | ReturnType<typeof updateProduct>
  | ReturnType<typeof deleteProduct>;
