import { Dispatch } from 'redux';
import { PaymentType } from '../../interfaces/profile/payment/paymentType';
import { FETCH_PAYMENTS } from '../../interfaces/profile/payment/constants';
import { api } from '../../utils/api';

export const getPayments = (payments: PaymentType) => {
  return {
    type: FETCH_PAYMENTS,
    payload: payments,
  };
};

export const fetchingPayments = (userId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.get(`/payments/user/${userId}`);
      dispatch(getPayments(response.data));
    } catch (error) {
      console.log(error);
    }
  };
};
