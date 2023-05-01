import React from 'react';
import { useSelector } from 'react-redux';
import SingleProduct from '../../components/Cart/Product/SingleProduct';
import { Input } from '../../components/Input/Input';
import { RootState } from '../../redux/store';
import './Checkout.scss';

import { darkTheme, lightTheme } from '../../styles/styles';
import { GlobalTheme } from '../../context/ThemeProvider';

const Checkout = () => {
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const { itemInCart } = useSelector((state: RootState) => state.cart);
  const { theme } = GlobalTheme();

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
  };

  const toPay = () => {
    let total = 0;
    itemInCart?.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <div className="checkout-view">
      <div className="checkout-view__cart">
        {itemInCart?.map((item) => (
          <SingleProduct item={item} key={item.id} />
        ))}
        <div
          className="checkout-view__cart__total"
          style={{
            color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
            backgroundColor: theme === 'dark' ? darkTheme.shadow : lightTheme.shadow,
            boxShadow: `0 0 5px 0 ${theme === 'dark' ? darkTheme.shadowMedium : lightTheme.shadowMedium}`,

          }}
        >
          <p className="checkout-view__cart__total--label">Total to pay</p>
          <p className="checkout-view__cart__total--price">$ {toPay()}</p>
        </div>
      </div>
      <div
        className="checkout-view__payment-method"
        style={{
          color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
        }}
      >
        <h1 className="checkout-view__payment-method--label">Select a payment method</h1>
        <div className="checkout-view__payment-method__card-number">
          <Input
            name="Card number"
            placeholder="Write.."
            onChange={handleCardNumber}
            value={cardNumber}
          />
          <p>cvc</p>
          <input type="text" />
        </div>
        <div className="checkout-view__payment-method__cards">
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200432/shoes/descarga_1_uln1vl.png"
              alt="visa"
              style={{
                width: '60%',
                height: '40%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200437/shoes/images_9_1_klgpe6.png"
              alt="visa"
              style={{
                width: '70%',
                height: '40%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200452/shoes/images_10_hrrpnz.png"
              alt="visa"
              style={{
                width: '60%',
                height: '30%',
                objectFit: 'fill',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
