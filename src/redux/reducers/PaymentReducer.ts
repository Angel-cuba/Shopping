import { AnyAction } from "redux";
import { ERROR, FETCH_FAILURE, FETCH_PAYMENTS, FETCH_SUCCESS, LOADING, PaymentState, REQUEST, STOP_LOADING } from "../../interfaces/profile/payment/constants";


export const initialPaymentState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
  success: false
};

export default function paymentReducer(state = initialPaymentState, action: AnyAction) {
  switch (action.type) {
    case FETCH_PAYMENTS:
      return {
        ...state,
        payments: action.payload,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        success: true,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        success: false,
      };
    case REQUEST:
      return {
        ...state,
        success: false,
      };
    default:
      return state;
  }
}