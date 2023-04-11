import React, { FormEvent } from 'react'
import { UserType } from '../../interfaces/user/UserType'
import { Input } from '../../components/Input/Input'

type ProfilePaymentProps = {
  userEdited: UserType
  setUserEdited: (userEdited: UserType) => void
  setEditPayment: (editPayment: boolean) => void
}
const ProfilePayment = ({ userEdited, setUserEdited, setEditPayment }: ProfilePaymentProps) => {
  const today = new Date()
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0')
  const currentYear = today.getFullYear().toString()

  const closeForm = () => {
    setEditPayment(false)
    setUserEdited({
      ...userEdited,
      cardHolder: '',
      paymentType: '',
      provider: '',
      accountNumber: '',
      expirationDate: ''
    })
  }
  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('handlerSubmit', userEdited)
  }
  return (
    <div className="profile__edit-form__container">
      <h1>ProfilePayment</h1>
      <form onClick={handlerSubmit}>
        <Input
          type="text"
          name="card name"
          value={userEdited.cardHolder ?? ''}
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              cardHolder: e.target.value
            })
          }
          placeholder={!userEdited.cardHolder ? 'Full card name' : userEdited.cardHolder}
          style={styles}
          admin
          profile
        />
        <div className="profile__edit-form__container__small">
          <Input
            type="text"
            name="Type"
            value={userEdited.paymentType ?? ''}
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                paymentType: e.target.value
              })
            }
            placeholder={!userEdited.paymentType ? 'Type' : userEdited.paymentType}
            style={styleSmall}
            small
          />
          <Input
            type="text"
            name="Provider"
            value={userEdited.provider ?? ''}
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                provider: e.target.value
              })
            }
            placeholder={!userEdited.provider ? 'Provider' : userEdited.provider}
            style={styleSmall}
            small
          />
        </div>
        <Input
          type="text"
          name="card number"
          value={userEdited.accountNumber ?? ''}
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              accountNumber: e.target.value
            })
          }
          placeholder={!userEdited.accountNumber ? 'Full card number' : userEdited.accountNumber}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="expiration date"
          value={userEdited.expirationDate ?? `${currentMonth}/${currentYear}`}
          min={`${currentYear}-${currentMonth}`}
          max={`${currentYear + 10}-12`}
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              expirationDate: e.target.value
            })
          }
          placeholder={!userEdited.expirationDate ? 'Expiration date' : userEdited.expirationDate}
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

export default ProfilePayment

const styles = {
  width: '280px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px'
}

const styleSmall = {
  width: '100px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px'
}
