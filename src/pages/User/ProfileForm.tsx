import React, { FormEvent } from 'react'
import { UserType } from '../../interfaces/user/UserType'
import { Input } from '../../components/Input/Input'

type Props = {
  user: UserType
  userEdited: UserType
  setUserEdited: (userEdited: UserType) => void
  setEdit: (edit: boolean) => void
}

const ProfileForm = ({ user, userEdited, setUserEdited, setEdit }: Props) => {
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (userEdited.password !== confirmPassword) {
      return alert('Passwords do not match')
    }
    setUserEdited(userEdited)
    setEdit(false)
  }
  const cancellForm = () => {
    setEdit(false)
    setUserEdited({
      ...userEdited,
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: ''
    })
  }
  return (
    <div className="profile__edit-form__container">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={!user.name ? (userEdited.name ? userEdited.name : '') : user.name}
          onChange={(e) => setUserEdited({ ...userEdited, name: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={!user.name ? (userEdited.name ? userEdited.name : 'Full name') : user.name}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="email"
          value={!user.email ? (userEdited.email ? userEdited.email : '') : user.email}
          onChange={(e) => setUserEdited({ ...userEdited, email: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.email ? (userEdited.email ? userEdited.email : 'youremail@gmail.com') : user.email
          }
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="password"
          value={!user.password ? (userEdited.password ? userEdited.password : '') : user.password}
          onChange={(e) => setUserEdited({ ...userEdited, password: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.password
              ? userEdited.password
                ? userEdited.password
                : '***********'
              : user.password
          }
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="profile__edit-form__container__input"
          placeholder={!confirmPassword ? 'Confirm password' : confirmPassword}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="phone"
          value={!user.phone ? (userEdited.phone ? userEdited.phone : '') : user.phone}
          onChange={(e) => setUserEdited({ ...userEdited, phone: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.phone ? (userEdited.phone ? userEdited.phone : '+123 45 67 89000') : user.phone
          }
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="address"
          value={!user.address ? (userEdited.address ? userEdited.address : '') : user.address}
          onChange={(e) => setUserEdited({ ...userEdited, address: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.address ? (userEdited.address ? userEdited.address : 'Street 1') : user.address
          }
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="city"
          value={!user.city ? (userEdited.city ? userEdited.city : '') : user.city}
          onChange={(e) => setUserEdited({ ...userEdited, city: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={!user.city ? (userEdited.city ? userEdited.city : 'City') : user.city}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="country"
          value={!user.country ? (userEdited.country ? userEdited.country : '') : user.country}
          onChange={(e) => setUserEdited({ ...userEdited, country: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.country ? (userEdited.country ? userEdited.country : 'Country') : user.country
          }
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="postalCode"
          value={
            !user.postalCode
              ? userEdited.postalCode
                ? userEdited.postalCode
                : ''
              : user.postalCode
          }
          onChange={(e) => setUserEdited({ ...userEdited, postalCode: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={
            !user.postalCode
              ? userEdited.postalCode
                ? userEdited.postalCode
                : 'Postal Code'
              : user.postalCode
          }
          style={styles}
          admin
          profile
        />
        <button type="submit" className="profile__edit-form__container__button">
          Confirm
        </button>
      </form>
      <div className="profile__edit-form__container--cancel" onClick={cancellForm}>
        Cancel
      </div>
    </div>
  )
}

export default ProfileForm

const styles = {
  width: '280px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px'
}
