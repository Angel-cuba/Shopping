import { Dispatch } from 'redux';
import { api } from '../../utils/api';
import {
  ADD_ADDRESS,
  DELETE_ADDRESS,
  ERROR,
  FETCH_ALL_ADDRESS,
  LOADING,
  STOP_LOADING,
  UPDATE_ADDRESS,
} from '../../interfaces/profile/address/constants';
import { AddressToSend, AddressType } from '../../interfaces/profile/address/AddressType';

export const getAddresses = (addresses: AddressType) => {
  return {
    type: FETCH_ALL_ADDRESS,
    payload: addresses,
  };
};

export const addAddress = (address: AddressToSend) => {
  return {
    type: ADD_ADDRESS,
    payload: address,
  }as const;
};

export const updateAddress = (address: AddressToSend) => {
  return {
    type: UPDATE_ADDRESS,
    payload: address,
  };
};

export const deleteAddress = (addressId: string) => {
  return {
    type: DELETE_ADDRESS,
    payload: addressId,
  };
};

export const fetchingAddresses = (userId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOADING });
      const response = await api.get(`/addresses/user/${userId}`);
      if (response.status !== 200) {
        dispatch({ type: ERROR, payload: response.data });
      } else {
        dispatch(getAddresses(response.data));
      }
    } catch (error) {
      dispatch({ type: ERROR, payload: error });
    }
    dispatch({ type: STOP_LOADING });
  };
};

export const addingAddress = (address: AddressToSend) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({type:LOADING})
      const request = await api.post('/addresses', address)
      dispatch(addAddress(request.data))
    } catch (error) {
      dispatch({ type: ERROR, payload: error})
    }
    dispatch({ type: STOP_LOADING })
  }
}

export const updatingAddress = (address: AddressToSend) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({type:LOADING})
      const request = await api.put(`/addresses`, address)
      dispatch(updateAddress(request.data))
    } catch (error) {
      dispatch({ type: ERROR, payload: error})
    }
    dispatch({ type: STOP_LOADING })
  }
}

export const deletingAddress = (addressId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({type:LOADING})
      await api.delete(`/addresses/${addressId}`)
      dispatch(deleteAddress(addressId))
    } catch (error) {
      dispatch({ type: ERROR, payload: error})
    }
    dispatch({ type: STOP_LOADING })
  }
}
