import { AddressType } from "./AddressType";


export const FETCH_ALL_ADDRESS = 'FETCH_ALL_ADDRESS';
export const FETCH_SUCCESS = 'FETCH_ALL_ADDRESS_SUCCESS';
export const FETCH_FAILURE = 'FETCH_ALL_ADDRESS_FAILURE';
export const FETCH_ADDRESS = 'FETCH_ADDRESS';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';
export const LOADING = 'LOADING';
export const STOP_LOADING = 'STOP_LOADING';
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

export type FetchAllAddressAction = {
  type: typeof FETCH_ALL_ADDRESS;
  payload: AddressType[];
};

export type FetchAddressAction = {
  type: typeof FETCH_ADDRESS;
  payload: AddressType;
};

export type AddAddressAction = {
  type: typeof ADD_ADDRESS;
  payload: AddressType;
};

export type UpdateAddressAction = {
  type: typeof UPDATE_ADDRESS;
  payload: AddressType;
};

export type DeleteAddressAction = {
  type: typeof DELETE_ADDRESS;
  payload: string;
};

export type AddressActionTypes =
  | FetchAllAddressAction
  | FetchAddressAction
  | AddAddressAction
  | UpdateAddressAction
  | DeleteAddressAction
  | LoadingAction
  | StopLoadingAction
  | ErrorAction;

export type AddressState = {
  addresses: AddressType[];
  loading: boolean;
  error: string | null;
  success: boolean;
};