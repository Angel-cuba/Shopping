import { Product } from './ProductType';

export const GET_PRODUCTS = 'GET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const LOADING = 'LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const REQUEST = 'REQUEST'
export const SUCCESSFUL = 'SUCCESSFUL';
export const FAILURE = 'FAILURE';
export const ERROR = 'ERROR';

export type LoadingAction = {
  type: typeof LOADING;
};
export type StopLoadingAction = {
  type: typeof STOP_LOADING;
};
export type ErrorAction = {
  type: typeof ERROR;
  payload: string | null;
};

export type GetProductsAction = {
  type: typeof GET_PRODUCTS;
  payload: Product[];
};

export type AddProductAction = {
  type: typeof ADD_PRODUCT;
  payload: Product;
};

export type UpdateProductAction = {
  type: typeof UPDATE_PRODUCT;
  payload: Product;
};

export type DeleteProductAction = {
  type: typeof DELETE_PRODUCT;
  payload: string;
};

export type RequestAction = {
  type: typeof REQUEST;
}

export type SuccessFulAction = {
  type: typeof SUCCESSFUL;
};

export type FailureAction = {
  type: typeof FAILURE;
};

export type ProductActionTypes =
  | GetProductsAction
  | LoadingAction
  | StopLoadingAction
  | ErrorAction
  | RequestAction
  | SuccessFulAction
  | FailureAction;

export type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  success: boolean;
};
