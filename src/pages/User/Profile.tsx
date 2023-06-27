import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
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
import LoadingResponse from '../../components/Loading/LoadingResponse';
import { deletingAddress, fetchingAddresses } from '../../redux/actions/AddressAction';
import { deletingPayment, fetchingPayments } from '../../redux/actions/PaymentAction';
import { api } from '../../utils/api';
import { notifyDelete, notifyError } from '../../utils/notify';
import { Link } from 'react-router-dom';
import './Profile.scss';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userLogged);
  const decodedUserId = JSON.parse(localStorage.getItem('decodedUser') || '{}').user_id;

  const [edit, setEdit] = React.useState(false);
  const [openPaymentToEdit, setOpenPaymentToEdit] = React.useState(false);
  const [userEdited, setUserEdited] = React.useState<UserFromDB>();
  const [selectedPayment, setSelectedPayment] = React.useState<UserPayment>();
  const [selectedAddress, setSelectedAddress] = React.useState<UserAddress>();
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  const { theme } = GlobalTheme();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchingAddresses(decodedUserId));
    dispatch(fetchingPayments(decodedUserId));
  }, [dispatch, decodedUserId]);

  const { payments, error } = useSelector((state: RootState) => state.payments);
  const { addresses } = useSelector((state: RootState) => state.addresses);

  const lastPaymentMethod = payments?.[payments.length - 1];
  const lastAddress = addresses?.[addresses.length - 1];

  if (error) {
    notifyError('Something went wrong, please try later');
  }

  useLayoutEffect(() => {
    const request = async () => {
      const fetchUserData = await api.get(`/users/${decodedUserId}`);

      setUserEdited(fetchUserData.data);
    };
    request();
  }, [decodedUserId]);

  const handleOpenProfile = () => {
    setEdit(!edit);
    setOpenPaymentToEdit(false);
  };
  const handleOpenPayment = () => {
    setOpenPaymentToEdit(!openPaymentToEdit);
    setEdit(false);
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

  const userPayments = payments?.map((payment: UserPayment) => {
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

  const userAddresses = addresses.map((address: UserAddress) => {
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
    setLoadingProfile(true);
    try {
      dispatch(deletingAddress(addressId));
      notifyDelete('Address deleted successfully');
    } catch (error) {
      notifyError('Error to delete address, try again later');
    }
    setSelectedAddress(undefined);
    setLoadingProfile(false);
  };

  const deletePayment = (paymentId: string) => {
    setLoadingProfile(true);
    try {
      dispatch(deletingPayment(paymentId));
      notifyDelete('Payment deleted');
    } catch (error) {
      notifyError('Error to delete card, try again later');
    }
    setSelectedPayment(undefined);
    setLoadingProfile(false);
  };

  const handleOpenAddress = () => {
    setEdit(!edit);
  };

  return (
    <div className="profile">
      {loadingProfile && (
        <div className="profile__loading">
          <LoadingResponse />
        </div>
      )}
      <div className="profile__edit-button" onClick={handleOpenProfile}>
        {edit ? 'Close editing view' : 'Edit profile'}
      </div>
      <Link to="/history" className="profile__history-button-editing-open">
        History
      </Link>
      {edit && userEdited && (
        <div className="profile__edit-form">
          <ProfileAddress
            address={selectedAddress}
            userId={userEdited?.id}
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEdit={setEdit}
            setLoading={setLoadingProfile}
            addresses={addresses}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
      )}
      {openPaymentToEdit && (
        <div className="profile__edit-form">
          <ProfilePayment
            selectedPayment={selectedPayment}
            userId={userEdited?.id}
            setOpenPaymentToEdit={setOpenPaymentToEdit}
            openPaymentToEdit={openPaymentToEdit}
            setSelectedPayment={setSelectedPayment}
          />
        </div>
      )}
      <h1>Welcome {userEdited ? `${userEdited.firstname}` : ``}</h1>
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
          <div className="profile__data__payment-info__user-addresses">{userAddresses}</div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <StreetviewTwoTone style={iconStyles} />
            </div>
            {!selectedAddress?.address
              ? !lastAddress?.address
                ? 'Address'
                : lastAddress.address
              : selectedAddress.address}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Apartment style={iconStyles} />
            </div>
            {!selectedAddress?.city
              ? !lastAddress?.city
                ? 'City'
                : lastAddress.city
              : selectedAddress.city}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PostAdd style={iconStyles} />
            </div>
            {!selectedAddress?.postalCode
              ? !lastAddress?.postalCode
                ? 'Postal Code'
                : lastAddress.postalCode
              : selectedAddress.postalCode}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PublicRounded style={iconStyles} />
            </div>
            {!selectedAddress?.country
              ? !lastAddress?.country
                ? 'Country'
                : lastAddress.country
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
            {!openPaymentToEdit ? (
              !selectedPayment?.id && !openPaymentToEdit ? (
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
