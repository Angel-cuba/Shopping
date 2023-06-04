import React, { FormEvent } from 'react';
import { UserPayment } from '../../interfaces/user/UserType';
import { Input } from '../../components/Input/Input';
import { api } from '../../utils/api';
import { notifyError } from '../../utils/notify';

type ProfilePaymentProps = {
  userId: string | undefined;
  editPayment: boolean;
  setEditPayment: (editPayment: boolean) => void;
  setPayments: (payments: UserPayment) => void;
  payment: UserPayment | undefined;
};

const initialUserPayment: UserPayment = {
  paymentType: '',
  provider: '',
  cardNumber: '',
  expirationDate: '',
  cardHolderName: '',
};
const ProfilePayment = ({
  userId,
  editPayment,
  setEditPayment,
  setPayments,
  payment,
}: ProfilePaymentProps) => {
  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = today.getFullYear().toString();
  const [userPaymentMethod, setUserPaymentMethod] = React.useState<UserPayment>(
    !payment?.id ? initialUserPayment : payment
  );

  const cancellForm = () => {
    setEditPayment(!editPayment);
    setUserPaymentMethod(initialUserPayment);
  };
  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userPaymentMethod) {
      setUserPaymentMethod(userPaymentMethod);
    }
    sendPaymentData();
  };

  const sendPaymentData = async () => {
    const paymentData = {
      paymentType: userPaymentMethod?.paymentType,
      provider: userPaymentMethod?.provider,
      cardNumber: userPaymentMethod?.cardNumber,
      expirationDate: userPaymentMethod?.expirationDate,
      cardHolderName: userPaymentMethod?.cardHolderName,
      user: {
        id: userId,
      },
    };
    const updatePaymentData = {
      id: userPaymentMethod?.id,
      paymentType: userPaymentMethod?.paymentType,
      provider: userPaymentMethod?.provider,
      cardNumber: userPaymentMethod?.cardNumber,
      expirationDate: userPaymentMethod?.expirationDate,
      cardHolderName: userPaymentMethod?.cardHolderName,
      user: {
        id: userId,
      },
    };
    if (!userPaymentMethod.id) {
      const response = await api.post('/payments', paymentData);
      setPayments(response.data);
      if (response.status === 200) {
        setEditPayment(false);
      } else {
        notifyError('Error');
      }
    } else {
      const response = await api.put('/payments', updatePaymentData);
      setPayments(response.data);
      if (response.status === 200) {
        setEditPayment(false);
      } else {
        notifyError('Error');
      }
    }
  };

  const handlePayment = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.currentTarget;
    setUserPaymentMethod({
      ...userPaymentMethod,
      [name]: value,
    });
  };

  return (
    <div className="profile__edit-form__container">
      <h1>Payment method</h1>
      <form>
        <Input
          type="text"
          name="cardHolderName"
          value={userPaymentMethod?.cardHolderName ? userPaymentMethod.cardHolderName : ''}
          onChange={handlePayment}
          placeholder={
            userPaymentMethod?.cardHolderName ? userPaymentMethod.cardHolderName : 'Full card name'
          }
          style={styles}
          admin
          profile
        />
        <div className="profile__edit-form__container__small">
          <Input
            type="text"
            name="paymentType"
            value={userPaymentMethod?.paymentType ? userPaymentMethod.paymentType : ''}
            onChange={handlePayment}
            placeholder={userPaymentMethod?.paymentType ? userPaymentMethod.paymentType : 'Type'}
            style={styleSmall}
            small
          />
          <Input
            type="text"
            name="provider"
            value={userPaymentMethod?.provider ? userPaymentMethod.provider : ''}
            onChange={handlePayment}
            placeholder={userPaymentMethod?.provider ? userPaymentMethod.provider : 'Provider'}
            style={styleSmall}
            small
          />
        </div>
        <Input
          type="text"
          name="cardNumber"
          value={userPaymentMethod?.cardNumber ? userPaymentMethod.cardNumber : ''}
          onChange={handlePayment}
          placeholder={userPaymentMethod?.cardNumber ? userPaymentMethod.cardNumber : 'Card number'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="expirationDate"
          value={userPaymentMethod?.expirationDate ?? `${currentMonth}/${currentYear}`}
          min={`${currentYear}-${currentMonth}`}
          max={`${currentYear + 10}-12`}
          onChange={handlePayment}
          placeholder={
            userPaymentMethod?.expirationDate ? userPaymentMethod.expirationDate : 'Expiration date'
          }
          style={styles}
          admin
          profile
        />
        <button onClick={handlerSubmit} className="profile__edit-form__container__button">
          {userPaymentMethod?.id ? 'Update' : 'Add'}
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
