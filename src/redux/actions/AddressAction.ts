import { Dispatch } from "redux";
import { api } from "../../utils/api";
import { FETCH_ALL_ADDRESS } from "../../interfaces/profile/address/constants";
import { AddressType } from "../../interfaces/profile/address/AddressType";


export const getAddresses = (addresses: AddressType) => {
 return {
  type: FETCH_ALL_ADDRESS,
  payload: addresses
 }
}


export const fetchingAddresses = (userId: string ) => {
  return async (dispatch: Dispatch) => {
    try {
    const response = await api.get(`/addresses/user/${userId}`)
    dispatch(getAddresses(response.data));
    } catch (error) {
    console.log(error)
    }
  }
  }