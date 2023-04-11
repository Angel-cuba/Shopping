import React, { FormEvent } from 'react'
import { UserType } from '../../interfaces/user/UserType'
import { Input } from '../../components/Input/Input'

type Props = {
  userEdited: UserType
  setUserEdited: (userEdited: UserType) => void
  setEdit: (edit: boolean) => void
}

const ProfileForm = ({ userEdited, setUserEdited, setEdit }: Props) => {
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (userEdited.password !== confirmPassword) {
      return alert('Passwords do not match')
    }
    console.log(userEdited)
  }
  const closeForm = () => {
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
          value={userEdited.name}
          onChange={(e) => setUserEdited({ ...userEdited, name: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.name ?? 'Name'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="email"
          value={userEdited.email}
          onChange={(e) => setUserEdited({ ...userEdited, email: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.email ?? 'Email'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="password"
          value={userEdited.password}
          onChange={(e) => setUserEdited({ ...userEdited, password: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.password ?? 'Password'}
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
          placeholder={confirmPassword}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="phone"
          value={userEdited.phone ?? ''}
          onChange={(e) => setUserEdited({ ...userEdited, phone: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.phone ?? 'Phone'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="address"
          value={userEdited.address ?? ''}
          onChange={(e) => setUserEdited({ ...userEdited, address: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.address ?? 'Address'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="city"
          value={userEdited.city ?? ''}
          onChange={(e) => setUserEdited({ ...userEdited, city: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.city ?? 'City'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="country"
          value={userEdited.country ?? ''}
          onChange={(e) => setUserEdited({ ...userEdited, country: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.country ?? 'Country'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="postalCode"
          value={userEdited.postalCode ?? ''}
          onChange={(e) => setUserEdited({ ...userEdited, postalCode: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.postalCode ?? 'Postal Code'}
          style={styles}
          admin
          profile
        />
        <button type="submit" className="profile__edit-form__container__button">
          Edit
        </button>
      </form>
      <div className="profile__edit-form__container--cancel" onClick={closeForm}>
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
