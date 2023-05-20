import React, { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserAddress, UserFromDB, UserPayment } from '../../interfaces/user/UserType';
import {
  AddSharp,
  Apartment,
  CardMembershipTwoTone,
  CardTravelTwoTone,
  DateRange,
  DeleteForever,
  Edit,
  Email,
  Numbers,
  PasswordSharp,
  Person,
  Phone,
  PostAdd,
  PublicRounded,
  StreetviewTwoTone,
} from '@mui/icons-material';
import ProfileAddress from './ProfileAndAddress';
import ProfilePayment from './ProfilePayment';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import { api } from '../../utils/api';
import './Profile.scss';
import LoadingResponse from '../../components/Loading/LoadingResponse';

const Profile = () => {
  //TODO: { user: UserType } is replaced by any
  const { user, userFromToken } = useSelector((state: RootState) => state.userLogged);
  const userId = userFromToken?.user_id || user?.id;
  const [edit, setEdit] = React.useState(false);
  const [editPayment, setEditPayment] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [userEdited, setUserEdited] = React.useState<UserFromDB>();
  const [userPaymentMethod, setUserPaymentMethod] = React.useState<UserPayment[]>();
  const [userAddress, setUserAddress] = React.useState<UserAddress[]>();
  const [address, setAddress] = React.useState<UserAddress>();
  const [payments, setPayments] = React.useState<UserPayment>();
  const [selectedPayment, setSelectedPayment] = React.useState<UserPayment>();
  const [selectedAddress, setSelectedAddress] = React.useState<UserAddress>();
  const [principalAddress, setPrincipalAddress] = React.useState<UserAddress>();
  const [loading, setLoading] = React.useState(false);

  const token = localStorage.getItem('token');
  const lastPaymentMethod = userPaymentMethod?.[userPaymentMethod?.length - 1];

  useEffect(() => {
    if (userAddress?.length) {
      setPrincipalAddress(userAddress[0]);
    }
  }, [userAddress, loading]);

  const { theme } = GlobalTheme();

  const handleOpenProfile = () => {
    setEdit(!edit);
    setEditPayment(false);
  };
  const handleOpenPayment = () => {
    setEditPayment(!editPayment);
    setEdit(false);
  };

  const handleOpenHistory = () => {
    setOpenHistory(!openHistory);
  };

  const iconStyles = {
    width: '60%',
    height: '100%',
    color: theme === 'dark' ? lightTheme.greyLight : darkTheme.greyDark,
  };

  const infoItemStyles = {
    color: theme === 'dark' ? lightTheme.greyLight : darkTheme.greyDark,
    fontWeight: 'bolder',
    boxShadow: `0px 0px 5px 0px ${
      theme === 'dark' ? lightTheme.shadowMedium : darkTheme.shadowMedium
    }`,
  };

  useEffect(() => {
    const userId = userFromToken?.user_id;
    const request = async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserEdited(response.data);
    };
    request();
  }, [userFromToken, token]);

  useLayoutEffect(() => {
    const request = async () => {
      const response = await api.get(`/payment/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        console.log('error');
      }
      setUserPaymentMethod(response.data);
    };
    request();
  }, [payments, token, userId]);

  useEffect(() => {
    const request = async () => {
      const response = await api.get(`/addresses/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserAddress(response.data);
    };
    request();
  }, [token, userId, address]);

  const userPayments = userPaymentMethod?.map((payment: UserPayment) => {
    const addingPayment = () => {
      if (selectedPayment?.id === payment.id) {
        setSelectedPayment(undefined);
      } else {
        setSelectedPayment(payment);
      }
    };
    return (
      <div key={payment.id} onClick={addingPayment}>
        <p
          className="profile__data__payment-info__user-payments__item"
          style={{
            backgroundColor: payment.id === selectedPayment?.id ? '#111010' : '',
            color: payment.id === selectedPayment?.id ? '#ffffff' : '',
            border: `1.4px solid ${theme === 'light' ? darkTheme.bg : lightTheme.shadow}`,
          }}
        >
          {payment.provider}
        </p>
      </div>
    );
  });

  const userAddressList = userAddress?.map((address: UserAddress) => {
    const addingAddress = () => {
      if (selectedAddress?.id === address.id) {
        setSelectedAddress(undefined);
      } else {
        setSelectedAddress(address);
      }
    };

    return (
        <p
          key={address.id}
          className="profile__data__payment-info__user-addresses__item"
          style={{
            backgroundColor: address.id === selectedAddress?.id ? '#111010' : '',
            color: address.id === selectedAddress?.id ? '#ffffff' : '',
            border: `1.4px solid ${theme === 'light' ? darkTheme.bg : lightTheme.shadow}`,
          }}
          onClick={addingAddress}
        >
          {address.city}
        </p>
    );
  });

  const updateAddress = () => {
    if (!selectedAddress) {
      return;
    } else {
      setEdit(!edit);
    }
  };

  const deleteAddress = (addressId: string) => {
    setLoading(true);
    try {
      const request = async () => {
        const response = await api.delete(`/addresses/${addressId}`);
        if (response.status === 200) {
          const filteredAddresses = userAddress?.filter(
            (address: UserAddress) => address.id !== addressId
          );
          setUserAddress(filteredAddresses);
        }
      };
      request();
    } catch (error) {
      console.log(error);
    }
    setUserAddress(undefined);
    setLoading(false);
  };

  const deletePayment = (paymentId: string) => {
    setLoading(true);
    try {
      const request = async () => {
        const response = await api.delete(`/payment/${paymentId}`);
        if (response.status === 200) {
          const filteredPayments = userPaymentMethod?.filter(
            (payment: UserPayment) => payment.id !== paymentId
          );
          setUserPaymentMethod(filteredPayments);
        }
      };
      request();
    } catch (error) {
      console.log(error);
    }
    setSelectedPayment(undefined);
    setLoading(false);
  };

  const handleOpenAddress = () => {
    setEdit(!edit);
  };

  return (
    <div className="profile">
      {loading && (
        <div className="profile__loading">
          <LoadingResponse />
        </div>
      )}
      <div className="profile__edit-button" onClick={handleOpenProfile}>
        {edit ? 'Close editing view' : 'Edit profile'}
      </div>
      <div
        className={!edit ? 'profile__history-button' : 'profile__history-button-editing-open'}
        onClick={handleOpenHistory}
      >
        History
      </div>
      {edit && userEdited && (
        <div className="profile__edit-form">
          <ProfileAddress
            address={selectedAddress}
            userId={userEdited?.id}
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEdit={setEdit}
            setAddresses={setAddress}
            setLoading={setLoading}
            userAddresses={userAddress}
          />
        </div>
      )}
      {editPayment && (
        <div className="profile__edit-form">
          <ProfilePayment
            payment={selectedPayment}
            userId={userEdited?.id}
            setEditPayment={setEditPayment}
            editPayment={editPayment}
            setPayments={setPayments}
          />
        </div>
      )}
      <h1>
        Welcome{' '}
        {userEdited ? `administrator ${userEdited.firstname}` : `Hello, please log in to continue`}
      </h1>
      <div className="profile__data">
        <div className="profile__data__image-and-info">
          <img
            src={user?.picture ? user.picture : 'https://i.imgur.com/HeIi0wU.png'}
            alt={user?.name}
            className="profile__data__image-and-info__image"
          />
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Person style={iconStyles} />
            </div>
            {userEdited?.username}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Email style={iconStyles} />
            </div>
            {userEdited?.email}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PasswordSharp style={iconStyles} />
            </div>
            ********
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Phone style={iconStyles} />
            </div>
            {userEdited?.phone}
          </div>
          <div className="profile__data__payment-info__user-addresses">{userAddressList}</div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <StreetviewTwoTone style={iconStyles} />
            </div>
            {!selectedAddress?.address
              ? !principalAddress?.address
                ? 'Address'
                : principalAddress.address
              : selectedAddress.address}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Apartment style={iconStyles} />
            </div>
            {!selectedAddress?.city
              ? !principalAddress?.city
                ? 'City'
                : principalAddress.city
              : selectedAddress.city}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PostAdd style={iconStyles} />
            </div>
            {!selectedAddress?.postalCode
              ? !principalAddress?.postalCode
                ? 'Postal Code'
                : principalAddress.postalCode
              : selectedAddress.postalCode}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PublicRounded style={iconStyles} />
            </div>
            {!selectedAddress?.country
              ? !principalAddress?.country
                ? 'Country'
                : principalAddress.country
              : selectedAddress.country}
          </div>
          {selectedAddress?.id && (
            <div
              className="profile__data__image-and-info__button-delete"
              onClick={() => deleteAddress(selectedAddress?.id as string)}
            >
              <DeleteForever />
            </div>
          )}
          {selectedAddress?.id && (
            <div className="profile__data__image-and-info__button-edit" onClick={updateAddress}>
              <Edit />
            </div>
          )}
          {!selectedAddress?.id && (
            <div className="profile__data__image-and-info__button-add" onClick={handleOpenAddress}>
              <AddSharp style={{ transform: 'scale(1.5)', marginRight: '10px' }} /> Address
            </div>
          )}
        </div>
        <div className="profile__data__payment-info">
          <div className="profile__data__payment-info__user-payments">{userPayments}</div>
          <div className="profile__data__payment-info__button" onClick={handleOpenPayment}>
            {!editPayment ? (
              !selectedPayment?.id && !editPayment ? (
                <span className="profile__data__payment-info__button--add-payment">
                  <AddSharp style={{ transform: 'scale(1.5)', marginRight: '10px' }} /> Payment
                </span>
              ) : (
                <Edit />
              )
            ) : (
              'Close view'
            )}
          </div>
          {selectedPayment?.id && (
            <div
              className="profile__data__payment-info__button-delete"
              onClick={() => deletePayment(selectedPayment?.id as string)}
            >
              <DeleteForever />
            </div>
          )}
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <Person style={iconStyles} />
            </div>
            {!selectedPayment?.cardHolderName
              ? !lastPaymentMethod?.cardHolderName
                ? 'Card Holder Name'
                : lastPaymentMethod.cardHolderName
              : selectedPayment.cardHolderName}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardTravelTwoTone style={iconStyles} />
            </div>
            {!selectedPayment?.paymentType
              ? !lastPaymentMethod?.paymentType
                ? 'Payment Type'
                : lastPaymentMethod.paymentType
              : selectedPayment.paymentType}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardMembershipTwoTone style={iconStyles} />
            </div>
            {!selectedPayment?.provider
              ? !lastPaymentMethod?.provider
                ? 'Provider'
                : lastPaymentMethod.provider
              : selectedPayment.provider}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <Numbers style={iconStyles} />
            </div>
            {!selectedPayment?.cardNumber
              ? !lastPaymentMethod?.cardNumber
                ? 'Card Number'
                : lastPaymentMethod.cardNumber
              : selectedPayment.cardNumber}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <DateRange style={iconStyles} />
            </div>
            {!selectedPayment?.expirationDate
              ? !lastPaymentMethod?.expirationDate
                ? 'Expiration Date'
                : lastPaymentMethod.expirationDate
              : selectedPayment.expirationDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
