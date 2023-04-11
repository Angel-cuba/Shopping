import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { UserType } from '../../interfaces/user/UserType'
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
  StreetviewTwoTone
} from '@mui/icons-material'
import ProfileForm from './ProfileForm'
import './Profile.scss'
import ProfilePayment from './ProfilePayment'

const Profile = () => {
  const { user }: { user: UserType } = useSelector((state: RootState) => state.userLogged)
  const [edit, setEdit] = React.useState(false)
  const [editPayment, setEditPayment] = React.useState(false)
  const [userEdited, setUserEdited] = React.useState<UserType>(user)

  const handleOpenProfile = () => {
    setEdit(!edit)
    setEditPayment(false)
  }
  const handleOpenPayment = () => {
    setEditPayment(!editPayment)
    setEdit(false)
  }
  const iconStyles = {
    width: '60%',
    height: '100%',
    color: '#6c6c6c'
  }

  return (
    <div className="profile">
      <div className="profile__edit-button" onClick={handleOpenProfile}>
        {edit ? 'Close editing view' : 'Edit profile'}
      </div>
      {edit && (
        <div className="profile__edit-form">
          <ProfileForm userEdited={userEdited} setUserEdited={setUserEdited} setEdit={setEdit} />
        </div>
      )}
      {editPayment && (
        <div className="profile__edit-form">
          <ProfilePayment
            userEdited={userEdited}
            setUserEdited={setUserEdited}
            setEditPayment={setEditPayment}
          />
        </div>
      )}
      <h1>Welcome {user.role === 'ADMIN' ? 'administrator' : ''}</h1>
      <div className="profile__data">
        <div className="profile__data__image-and-info">
          <img
            src={user?.picture}
            alt={user?.name}
            className="profile__data__image-and-info__image"
          />
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <Person style={iconStyles} />
            </div>
            {user.name}
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <PasswordSharp style={iconStyles} />
            </div>
            ***********************
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <Email style={iconStyles} />
            </div>
            {user.email}
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <Phone style={iconStyles} />
            </div>
            +1234566778
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <StreetviewTwoTone style={iconStyles} />
            </div>
            Pääskynlento 99 Z1
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <Apartment style={iconStyles} />
            </div>
            Turku
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <PostAdd style={iconStyles} />
            </div>
            00100
          </div>
          <div className="profile__data__image-and-info__item">
            <div className="profile__data__image-and-info__item--icon">
              <PublicRounded style={iconStyles} />
            </div>
            Finland
          </div>
        </div>
        <div className="profile__data__payment-info">
          <div className="profile__data__payment-info__button" onClick={handleOpenPayment}>
            Update payment information
          </div>
          <div className="profile__data__payment-info__item">
            <div className="profile__data__payment-info__item--icon">
              <Person style={iconStyles} />
            </div>
            John Doe
          </div>
          <div className="profile__data__payment-info__item">
            <div className="profile__data__payment-info__item--icon">
              <CardTravelTwoTone style={iconStyles} />
            </div>
            VISA
          </div>
          <div className="profile__data__payment-info__item">
            <div className="profile__data__payment-info__item--icon">
              <CardMembershipTwoTone style={iconStyles} />
            </div>
            Provider
          </div>
          <div className="profile__data__payment-info__item">
            <div className="profile__data__payment-info__item--icon">
              <Numbers style={iconStyles} />
            </div>
            1234 5678 9012 3456
          </div>
          <div className="profile__data__payment-info__item">
            <div className="profile__data__payment-info__item--icon">
              <DateRange style={iconStyles} />
            </div>
            12/22
          </div>
        </div>
      </div>
      <div className="profile__history">
        <h2>History</h2>
      </div>
    </div>
  )
}

export default Profile
