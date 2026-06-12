import { AnyAction } from 'redux';
import {
  ADD_ADDRESS,
  AddressState,
  DELETE_ADDRESS,
  FETCH_ALL_ADDRESS,
  UPDATE_ADDRESS,
} from '../../interfaces/profile/address/constants';

export const initialAddressState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
  success: false,
};

export default function addressReducer(state = initialAddressState, action: AnyAction) {
  switch (action.type) {
    case FETCH_ALL_ADDRESS: {
      return {
        ...state,
        addresses: action.payload,
      };
    }

    case ADD_ADDRESS:
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };

    case UPDATE_ADDRESS:
      const addresses = state.addresses.map((address) => {
        if (address.id === action.payload.id) {
          return action.payload;
        }
        return address;
      });
      return {
        ...state,
        addresses,
      };

    case DELETE_ADDRESS:
      const removedAddress = state.addresses.filter((address) => address.id !== action.payload);
      return {
        ...state,
        addresses: removedAddress,
      };

    default:
      return state;
  }
}
