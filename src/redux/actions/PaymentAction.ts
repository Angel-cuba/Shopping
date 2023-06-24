import { Dispatch } from 'redux';
import { PaymentToSend, PaymentType } from '../../interfaces/profile/payment/paymentType';
import {
  ADD_PAYMENT,
  DELETE_PAYMENT,
  ERROR,
  FETCH_PAYMENTS,
  LOADING,
  STOP_LOADING,
  UPDATE_PAYMENT,
} from '../../interfaces/profile/payment/constants';
import { api } from '../../utils/api';

export const getPayments = (payments: PaymentType) => {
  return {
    type: FETCH_PAYMENTS,
    payload: payments,
  } as const;
};

export const addPayment = (payment: PaymentType) => {
  return {
    type: ADD_PAYMENT,
    payload: payment,
  } as const;
};

export const updatePayment = (payment: PaymentType) => {
  return {
    type: UPDATE_PAYMENT,
    payload: payment,
  } as const;
};

export const deletePayment = (paymentId: string) => {
  return {
    type: DELETE_PAYMENT,
    payload: paymentId,
  } as const;
};

export const fetchingPayments = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING });
    try {
      const response = await api.get(`/payments/user/${userId}`);
      if (response.status !== 200) {
        dispatch({ type: ERROR, payload: response.data });
      } else {
        dispatch(getPayments(response.data));
      }
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const addingPayment = (payment: PaymentToSend) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING });
    try {
      const resquest = await api.post('/payments', payment);
      dispatch(addPayment(resquest.data));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const updatingPayment = (payment: PaymentToSend) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING });
    try {
      const resquest = await api.put('/payments', payment);
      dispatch(updatePayment(resquest.data));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const deletingPayment = (paymentId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING });
    try {
      await api.delete(`/payments/${paymentId}`);
      dispatch(deletePayment(paymentId));
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};
