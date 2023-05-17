import React, { FormEvent } from 'react';
import { UserFromDB } from '../../interfaces/user/UserType';
import { Input } from '../../components/Input/Input';
import {api} from '../../utils/api'

type ProfilePaymentProps = {
  userEdited: UserFromDB;
  setUserEdited: (userEdited: UserFromDB) => void;
  setEditPayment: (editPayment: boolean) => void;
};
const ProfilePayment = ({ userEdited, setUserEdited, setEditPayment }: ProfilePaymentProps) => {
  const [payments, setPayments] = React.useState([]);
  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = today.getFullYear().toString();
  const token = localStorage.getItem('token');

  const cancellForm = () => {
    setEditPayment(false);
    setUserEdited({
      ...userEdited,
      cardHolderName: '',
      paymentType: '',
      provider: '',
      cardNumber: '',
      expirationDate: '',
    });
  };
  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUserEdited(userEdited);
    sendPaymentData();
  };

  const sendPaymentData = async () => {
    const paymentData = {
      paymentType: userEdited.paymentType,
      provider: userEdited.provider,
      cardNumber: userEdited.cardNumber,
      expirationDate: userEdited.expirationDate,
      cardHolderName: userEdited.cardHolderName,
      user: {
        id: userEdited.id,
      }
    };
    try {
      const response = await api.post('/payment', paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data);
      if (response.status === 200) {
        setEditPayment(false);
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="profile__edit-form__container">
      <h1>Payment method</h1>
      <form onClick={handlerSubmit}>
        <Input
          type="text"
          name="card name"
          value={userEdited.cardHolderName ? userEdited.cardHolderName : ''}
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              cardHolderName: e.target.value,
            })
          }
          placeholder={userEdited.cardHolderName ? userEdited.cardHolderName : 'Full card name'}
          style={styles}
          admin
          profile
        />
        <div className="profile__edit-form__container__small">
          <Input
            type="text"
            name="Type"
            value={userEdited.paymentType ? userEdited.paymentType : ''}
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                paymentType: e.target.value,
              })
            }
            placeholder={userEdited.paymentType ? userEdited.paymentType : 'Type'}
            style={styleSmall}
            small
          />
          <Input
            type="text"
            name="Provider"
            value={userEdited.provider ? userEdited.provider : ''}
            onChange={(e) =>
              setUserEdited({
                ...userEdited,
                provider: e.target.value,
              })
            }
            placeholder={userEdited.provider ? userEdited.provider : 'Provider'}
            style={styleSmall}
            small
          />
        </div>
        <Input
          type="text"
          name="card number"
          value={userEdited.cardNumber ? userEdited.cardNumber : ''}
          onChange={(e) =>
            setUserEdited({
              ...userEdited,
              cardNumber: e.target.value,
            })
          }
          placeholder={userEdited.cardNumber ? userEdited.cardNumber : 'Card number'}
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
              expirationDate: e.target.value,
            })
          }
          placeholder={userEdited.expirationDate ? userEdited.expirationDate : 'Expiration date'}
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
  );
};

export default ProfilePayment;

const styles = {
  width: '280px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px',
};

const styleSmall = {
  width: '100px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px',
};
