import { Dispatch } from 'redux';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  ERROR,
  GET_PRODUCTS,
  LOADING,
  REQUEST,
  STOP_LOADING,
  SUCCESSFUL,
  UPDATE_PRODUCT,
} from '../../interfaces/products/constants';
import { NewProductToStock, Product } from '../../interfaces/products/ProductType';
import { api } from '../../utils/api';

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
    dispatch({ type: LOADING });
    try {
      const response = await api.get('/products')
        dispatch(getProducts(response.data));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
      dispatch({ type: STOP_LOADING });
  };
};

export const addProductToStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    try {
       dispatch({ type: REQUEST });
       const resquest = await api.post('/products', product);
      dispatch(addProduct(resquest.data));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
     dispatch({ type: SUCCESSFUL });
  };
};

export const updateProductInStock = (product: NewProductToStock) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: REQUEST });
      const request = await api.put('/products', product);

      dispatch(updateProduct(request.data));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: SUCCESSFUL });
  };
};

export const deleteProductFromStock = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: REQUEST });
     const request = await api.delete(`/products/${id}`);
     //TODO: Do something with the response
      console.log(request);
      dispatch(deleteProduct(id));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: SUCCESSFUL });
  };
};

export type ProductActions =
  | ReturnType<typeof getProducts>
  | ReturnType<typeof addProduct>
  | ReturnType<typeof updateProduct>
  | ReturnType<typeof deleteProduct>;
