import React, { FormEvent } from 'react'
import { UserType } from '../../interfaces/user/UserType'
import { Input } from '../../components/Input/Input'

type ProfilePaymentProps = {
  user: UserType
  userEdited: UserType
  setUserEdited: (userEdited: UserType) => void
  setEditPayment: (editPayment: boolean) => void
}
const ProfilePayment = ({
  user,
  userEdited,
  setUserEdited,
  setEditPayment
}: ProfilePaymentProps) => {
  const today = new Date()
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0')
  const currentYear = today.getFullYear().toString()

  const cancellForm = () => {
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
    setUserEdited(userEdited)
    setEditPayment(false)
  }
  return (
    <div className="profile__edit-form__container">
      <h1>Payment method</h1>
      <form onClick={handlerSubmit}>
        <Input
          type="text"
          name="card name"
          value={
            !user.cardHolder
              ? userEdited.cardHolder
                ? userEdited.cardHolder
                : ''
              : user.cardHolder
          }
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              cardHolder: e.target.value
            })
          }
          placeholder={
            !user.cardHolder
              ? userEdited.cardHolder
                ? userEdited.cardHolder
                : 'Full card name'
              : user.cardHolder
          }
          style={styles}
          admin
          profile
        />
        <div className="profile__edit-form__container__small">
          <Input
            type="text"
            name="Type"
            value={
              !user.paymentType
                ? userEdited.paymentType
                  ? userEdited.paymentType
                  : ''
                : user.paymentType
            }
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                paymentType: e.target.value
              })
            }
            placeholder={
              !user.paymentType
                ? userEdited.paymentType
                  ? userEdited.paymentType
                  : 'Type'
                : user.paymentType
            }
            style={styleSmall}
            small
          />
          <Input
            type="text"
            name="Provider"
            value={
              !user.provider ? (userEdited.provider ? userEdited.provider : '') : user.provider
            }
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                provider: e.target.value
              })
            }
            placeholder={
              !user.provider
                ? userEdited.provider
                  ? userEdited.provider
                  : 'Provider'
                : user.provider
            }
            style={styleSmall}
            small
          />
        </div>
        <Input
          type="text"
          name="card number"
          value={
            !user.accountNumber
              ? userEdited.accountNumber
                ? userEdited.accountNumber
                : ''
              : user.accountNumber
          }
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              accountNumber: e.target.value
            })
          }
          placeholder={
            !user.accountNumber
              ? userEdited.accountNumber
                ? userEdited.accountNumber
                : 'Card number'
              : user.accountNumber
          }
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
          placeholder={
            !user.expirationDate
              ? userEdited.expirationDate
                ? userEdited.expirationDate
                : 'Expiration date'
              : user.expirationDate
          }
          style={styles}
          admin
          profile
        />
        <button type="submit" className="profile__edit-form__container__button">
          Save
        </button>
      </form>
      <div className="profile__edit-form__container--cancel" onClick={cancellForm}>
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
