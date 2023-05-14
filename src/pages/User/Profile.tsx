import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType } from '../../interfaces/user/UserType';
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
import './Profile.scss';

const Profile = () => {
  //TODO: { user: UserType } is replaced by any
  const { user }: any = useSelector((state: RootState) => state.userLogged);
  const [edit, setEdit] = React.useState(false);
  const [editPayment, setEditPayment] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [userEdited, setUserEdited] = React.useState<UserType>(user);

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
    boxShadow: `0px 0px 5px 0px ${theme === 'dark' ? lightTheme.shadowMedium : darkTheme.shadowMedium}`,
  };

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
      {edit && (
        <div className="profile__edit-form">
          <ProfileForm
            user={user}
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEdit={setEdit}
          />
        </div>
      )}
      {editPayment && (
        <div className="profile__edit-form">
          <ProfilePayment
            user={user}
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEditPayment={setEditPayment}
          />
        </div>
      )}
      <h1>
        Welcome {user ? `administrator ${user.given_name}` : `Hello, please log in to continue`}
      </h1>
      <div className="profile__data">
        <div className="profile__data__image-and-info">
          <img
            src={user?.picture}
            alt={user?.name}
            className="profile__data__image-and-info__image"
          />
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Person style={iconStyles} />
            </div>
            {user?.name}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Email style={iconStyles} />
            </div>
            {user?.email}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PasswordSharp style={iconStyles} />
            </div>
            {!user.password
              ? userEdited.password
                ? userEdited.password
                : '********'
              : user.password}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Phone style={iconStyles} />
            </div>
            {!user.phone ? (userEdited.phone ? userEdited.phone : 'Phone') : user.phone}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <StreetviewTwoTone style={iconStyles} />
            </div>
            {!user.address ? (userEdited.address ? userEdited.address : 'Address') : user.address}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <Apartment style={iconStyles} />
            </div>
            {!user.city ? (userEdited.city ? userEdited.city : 'City') : user.city}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PostAdd style={iconStyles} />
            </div>
            {!user.postalCode
              ? userEdited.postalCode
                ? userEdited.postalCode
                : 'Postal Code'
              : user.postalCode}
          </div>
          <div className="profile__data__image-and-info__item" style={infoItemStyles}>
            <div className="profile__data__image-and-info__item--icon">
              <PublicRounded style={iconStyles} />
            </div>
            {!user.country ? (userEdited.country ? userEdited.country : 'Country') : user.country}
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
            {!user.cardHolder
              ? userEdited.cardHolder
                ? userEdited.cardHolder
                : 'Card holder'
              : user.cardHolder}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardTravelTwoTone style={iconStyles} />
            </div>
            {!user.paymentType
              ? userEdited.paymentType
                ? userEdited.paymentType
                : 'VISA'
              : user.paymentType}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <CardMembershipTwoTone style={iconStyles} />
            </div>
            {!user.provider
              ? userEdited.provider
                ? userEdited.provider
                : 'Provider'
              : user.provider}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <Numbers style={iconStyles} />
            </div>
            {!user.accountNumber
              ? userEdited.accountNumber
                ? userEdited.accountNumber
                : '1234 5678 9012 3456'
              : user.accountNumber}
          </div>
          <div className="profile__data__payment-info__item" style={infoItemStyles}>
            <div className="profile__data__payment-info__item--icon">
              <DateRange style={iconStyles} />
            </div>
            {!user.expirationDate
              ? userEdited.expirationDate
                ? userEdited.expirationDate
                : 'MM/YY'
              : user.expirationDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
