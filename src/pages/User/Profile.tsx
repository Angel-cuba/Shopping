import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserFromDB, UserPayment } from '../../interfaces/user/UserType';
import {
  Apartment,
  CardMembershipTwoTone,
  CardTravelTwoTone,
  DateRange,
  Email,
  Numbers,
  PasswordSharp,
  Person,
  Phone,
  PostAdd,
  PublicRounded,
  StreetviewTwoTone,
} from '@mui/icons-material';
import ProfileForm from './ProfileAddress';
import ProfilePayment from './ProfilePayment';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import { api } from '../../utils/api';
import './Profile.scss';

const Profile = () => {
  //TODO: { user: UserType } is replaced by any
  const { user, userFromToken } = useSelector((state: RootState) => state.userLogged);
  const [edit, setEdit] = React.useState(false);
  const [editPayment, setEditPayment] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [userEdited, setUserEdited] = React.useState<UserFromDB>();
  const [userPaymentMethod, setUserPaymentMethod] = React.useState<UserPayment[]>();
  const [payments, setPayments] = React.useState<UserPayment>();
  const [selectedPayment, setSelectedPayment] = React.useState<UserPayment>();

  const lastPaymentMethod = userPaymentMethod?.[userPaymentMethod?.length - 1];

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserEdited(response.data);
    };
    request();
  }, [userFromToken]);

  useEffect(() => {
    const userId = userFromToken?.user_id || user?.id;

    const request = async () => {
      const response = await api.get(`/payment/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      if (response.status !== 200) {
        console.log('error');
      }
      setUserPaymentMethod(response.data);
    };
    request();
  }, [user?.id, userFromToken, payments]);

  const userPayments = userPaymentMethod?.map((payment: UserPayment) => {
    return (
      <div key={payment.id} onClick={() => setSelectedPayment(payment)}>
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

  return (
    <div className="profile">
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
          <ProfileForm userEdited={userEdited} setUserEdited={setUserEdited} setEdit={setEdit} />
        </div>
      )}
      {editPayment && (
        <div className="profile__edit-form">
          <ProfilePayment
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
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <StreetviewTwoTone style={iconStyles} />
            </div>
            {userEdited?.address ? userEdited.address : 'Address '}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Apartment style={iconStyles} />
            </div>
            {!userEdited?.city ? 'City' : userEdited.city}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PostAdd style={iconStyles} />
            </div>
            {userEdited?.postalCode ? userEdited.postalCode : 'Postal Code'}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PublicRounded style={iconStyles} />
            </div>
            {userEdited?.country ? userEdited.country : 'Country'}
          </div>
        </div>
        <div className="profile__data__payment-info">
          <div className="profile__data__payment-info__user-payments">{userPayments}</div>
          <div className="profile__data__payment-info__button" onClick={handleOpenPayment}>
            Add Payment Method
          </div>
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
