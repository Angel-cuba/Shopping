import React from 'react';
import { PaymentType } from '../../../interfaces/profile/payment/paymentType';
import { Cancel } from '@mui/icons-material';

type Props = {
  payments: PaymentType[];
  setOpenPayments: (openPayments: boolean) => void;
  setPayment: (payment: string) => void;
};
const Payment = ({ payments, setOpenPayments, setPayment }: Props) => {

  const setPaymentInfo = (payment: string) => {
    setPayment(payment);
    setOpenPayments(false);
  }
  return <div  className="checkout__checkout-view__payment-method__info--item__payments-view__item">
      <button className="checkout__checkout-view__payment-method__info--item__payments-view__item--button" onClick={() => setOpenPayments(false)}>
        <Cancel color='error'/>
      </button>
      <div className="checkout__checkout-view__payment-method__info--item__payments-view__item--info" >

     {payments.map((payment: PaymentType) => (
        <div key={payment.id} onClick={() => setPaymentInfo(payment.provider)} className="checkout__checkout-view__payment-method__info--item__payments-view__item--info--item">
          <p className="checkout__checkout-view__payment-method__info--item__payments-view__item--info--title">
            {payment.provider}
          </p>
        </div>
      ))}
      </div>

    </div>;
};

export default Payment;
