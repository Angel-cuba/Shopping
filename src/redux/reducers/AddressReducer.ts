import { AnyAction } from 'redux';
import { AddressState, FETCH_ALL_ADDRESS } from '../../interfaces/profile/address/constants';

export const initialAddressState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
  success: false
}

export default function addressReducer(state = initialAddressState, action: AnyAction) {
  switch (action.type) {
    case FETCH_ALL_ADDRESS: {
      return {
        ...state,
        addresses: action.payload,
      };
    }

    default:
      return state;
  }
}