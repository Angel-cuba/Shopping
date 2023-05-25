import { PaymentType } from "./paymentType";


export const FETCH_PAYMENTS = 'FETCH_PAYMENTS';
export const FETCH_SUCCESS = 'FETCH_PAYMENTS_SUCCESS';
export const FETCH_FAILURE = 'FETCH_PAYMENTS_FAILURE';
export const FETCH_PAYMENT = 'FETCH_PAYMENT';
export const ADD_PAYMENT = 'ADD_PAYMENT';
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT';
export const DELETE_PAYMENT = 'DELETE_PAYMENT';
export const LOADING = 'LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const REQUEST = 'REQUEST';
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

export type FetchAllPaymentsAction = {
  type: typeof FETCH_PAYMENTS;
  payload: PaymentType[];
};

export type FetchPaymentAction = {
  type: typeof FETCH_PAYMENT;
  payload: PaymentType;
};

export type AddPaymentAction = {
  type: typeof ADD_PAYMENT;
  payload: PaymentType;
};

export type UpdatePaymentAction = {
  type: typeof UPDATE_PAYMENT;
  payload: PaymentType;
};

export type DeletePaymentAction = {
  type: typeof DELETE_PAYMENT;
  payload: string;
};

export type RequestAction = {
  type: typeof REQUEST;
}

export type PaymentActionTypes =
  | FetchAllPaymentsAction
  | FetchPaymentAction
  | AddPaymentAction
  | UpdatePaymentAction
  | DeletePaymentAction
  | LoadingAction
  | StopLoadingAction
  | ErrorAction
  | RequestAction;

  export type PaymentState = {
    payments: PaymentType[];
    loading: boolean;
    error: string | null;
    success: boolean;
  };
