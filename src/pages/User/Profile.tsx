import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserFromDB } from '../../interfaces/user/UserType';
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
import ProfileForm from './ProfileForm';
import ProfilePayment from './ProfilePayment';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import axios from 'axios';
import './Profile.scss';

const Profile = () => {
  //TODO: { user: UserType } is replaced by any
  const { user, userFromToken } = useSelector((state: RootState) => state.userLogged);
  console.log('🚀 ~ file: Profile.tsx:28 ~ Profile ~ userFromToken:', userFromToken);
  const [edit, setEdit] = React.useState(false);
  const [editPayment, setEditPayment] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [userEdited, setUserEdited] = React.useState<UserFromDB>();
  console.log('🚀 ~ file: Profile.tsx:34 ~ Profile ~ userEdited:', userEdited);

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
    const userId = userFromToken.user_id || user?.id;
    const request = async () => {
      const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserEdited(response.data);
    };
    request();
  }, [userFromToken, user?.id]);

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
      {editPayment && userEdited && (
        <div className="profile__edit-form">
          <ProfilePayment
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEditPayment={setEditPayment}
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
          <div className="profile__data__payment-info__button" onClick={handleOpenPayment}>
            Update payment information
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <Person style={iconStyles} />
            </div>
            {userEdited?.cardHolder
                ? userEdited.cardHolder
                : 'Card holder'
              }
    
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardTravelTwoTone style={iconStyles} />
            </div>
            {userEdited?.paymentType
                ? userEdited.paymentType
                : 'VISA'}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardMembershipTwoTone style={iconStyles} />
            </div>
            {userEdited?.provider
                ? userEdited.provider
                : 'Provider'}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <Numbers style={iconStyles} />
            </div>
            {userEdited?.accountNumber
                ? userEdited.accountNumber
                : '1234 5678 9012 3456' }
    
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <DateRange style={iconStyles} />
            </div>
            {userEdited?.expirationDate
                ? userEdited.expirationDate
                : 'MM/YY'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
