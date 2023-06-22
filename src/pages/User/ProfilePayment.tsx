import React, { FormEvent, useEffect } from 'react';
import { UserPayment } from '../../interfaces/user/UserType';
import { Input } from '../../components/Input/Input';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addingPayment, updatingPayment } from '../../redux/actions/PaymentAction';
import { notifySuccess } from '../../utils/notify';

type ProfilePaymentProps = {
  userId: string | undefined;
  openPaymentToEdit: boolean;
  setOpenPaymentToEdit: (editPayment: boolean) => void;
  selectedPayment: UserPayment | undefined;
  setSelectedPayment: (payment: UserPayment | undefined) => void;
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
  openPaymentToEdit,
  setOpenPaymentToEdit,
  selectedPayment,
  setSelectedPayment
}: ProfilePaymentProps) => {
  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = today.getFullYear().toString();
  const [userPaymentMethod, setUserPaymentMethod] = React.useState<UserPayment | any>(
    !selectedPayment?.id ? initialUserPayment : selectedPayment
  );

  useEffect(() => {
    if(selectedPayment) {
      setUserPaymentMethod(selectedPayment);
    }
  }, [selectedPayment])

  const dispatch = useDispatch<AppDispatch>();

  const cancellForm = () => {
    setOpenPaymentToEdit(!openPaymentToEdit);
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
    if (!userPaymentMethod.id) {
      const paymentData = {
        paymentType: userPaymentMethod.paymentType,
        provider: userPaymentMethod.provider,
        cardNumber: userPaymentMethod.cardNumber,
        expirationDate: userPaymentMethod.expirationDate,
        cardHolderName: userPaymentMethod.cardHolderName,
        user: {
          id: userId,
        },
      };
      dispatch(addingPayment(paymentData));
      notifySuccess('Payment created')
      setOpenPaymentToEdit(false);
    } else {
      const updatePaymentData = {
        id: userPaymentMethod.id,
        paymentType: userPaymentMethod.paymentType,
        provider: userPaymentMethod.provider,
        cardNumber: userPaymentMethod.cardNumber,
        expirationDate: userPaymentMethod.expirationDate,
        cardHolderName: userPaymentMethod.cardHolderName,
        user: {
          id: userId,
        },
      };
      dispatch(updatingPayment(updatePaymentData));
      setOpenPaymentToEdit(false);
      notifySuccess('Payment updated')
      setSelectedPayment(undefined)
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
          value={userPaymentMethod.cardHolderName ? userPaymentMethod.cardHolderName : ''}
          onChange={handlePayment}
          placeholder={
            userPaymentMethod.cardHolderName ? userPaymentMethod.cardHolderName : 'Full card name'
          }
          style={styles}
          admin
          profile
        />
        <div className="profile__edit-form__container__small">
          <Input
            type="text"
            name="paymentType"
            value={userPaymentMethod.paymentType ? userPaymentMethod.paymentType : ''}
            onChange={handlePayment}
            placeholder={userPaymentMethod.paymentType ? userPaymentMethod.paymentType : 'Type'}
            style={styleSmall}
            small
          />
          <Input
            type="text"
            name="provider"
            value={userPaymentMethod.provider ? userPaymentMethod.provider : ''}
            onChange={handlePayment}
            placeholder={userPaymentMethod.provider ? userPaymentMethod.provider : 'Provider'}
            style={styleSmall}
            small
          />
        </div>
        <Input
          type="text"
          name="cardNumber"
          value={userPaymentMethod.cardNumber ? userPaymentMethod.cardNumber : ''}
          onChange={handlePayment}
          placeholder={userPaymentMethod.cardNumber ? userPaymentMethod.cardNumber : 'Card number'}
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
            userPaymentMethod.expirationDate ? userPaymentMethod.expirationDate : 'Expiration date'
          }
          style={styles}
          admin
          profile
        />
        <button onClick={handlerSubmit} className="profile__edit-form__container__button">
          {userPaymentMethod.id ? 'Update' : 'Add'}
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
