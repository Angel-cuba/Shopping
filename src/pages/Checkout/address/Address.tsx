import React from 'react';
import { AddressType } from '../../../interfaces/profile/address/AddressType';
import { Cancel } from '@mui/icons-material';

type Props = {
  addresses: AddressType[];
  setOpenAddress: (openAddress: boolean) => void;
  setAddress: (address: string) => void
};

const Address = ({ addresses, setOpenAddress, setAddress }: Props) => {
  const setAddressInfo = (address: string) => {
    setAddress(address);
    setOpenAddress(false);
  }
  return (
    <div className="checkout__checkout-view__payment-method__info--item__address-view__item">
      <button className="checkout__checkout-view__payment-method__info--item__address-view__item--button" onClick={() => setOpenAddress(false)}>
        <Cancel color='error'/>
      </button>
      <div className="checkout__checkout-view__payment-method__info--item__address-view__item--info">

      {addresses.map((address: AddressType) => (
        <div key={address.id}  className="checkout__checkout-view__payment-method__info--item__address-view__item--info--item" onClick={() =>setAddressInfo(`${address.address}, ${address.city}, ${address.country}`)}>
          <p className="checkout__checkout-view__payment-method__info--item__address-view__item--info--title">
            {address.address} in {address.city},
          </p>
          <p> {address.country}</p>
          <p>Postal code: {address.postalCode}</p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Address;
