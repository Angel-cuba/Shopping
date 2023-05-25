import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleProduct from '../../components/Cart/Product/SingleProduct';
import { Input } from '../../components/Input/Input';
import { RootState } from '../../redux/store';
import './Checkout.scss';

import { darkTheme, lightTheme } from '../../styles/styles';
import { GlobalTheme } from '../../context/ThemeProvider';
import { api } from '../../utils/api';
import { clearCart } from '../../redux/actions/CartActions';

type Item = {
  id: string;
};

const Checkout = () => {
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const { itemInCart } = useSelector((state: RootState) => state.cart);
  const { userFromToken } = useSelector((state: RootState) => state.userLogged);
  
  const { theme } = GlobalTheme();
  const dispatch = useDispatch();

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
  const handleCheckout = async () => {
    setLoading(true);
    const newArray = itemInCart?.map((item) => {
      const { id, variant, image, sizes, price, quantity } = item;
      const productId = id;
      const size = sizes;
      return {
        productId,
        variant,
        image,
        size,
        price,
        quantity,
        user: {
          id: userFromToken?.user_id,
        },
      };
    });
    const response = await api.post('/order-details/create-order-details', newArray);
    if (response.status === 200) {
      const idsToCreateOrder = response.data.map((item: Item) => item.id);
      const orderToCreate = {
        user: {
          id: userFromToken?.user_id,
        },
        orderDetails: idsToCreateOrder,
        paymentType: 'MASTER',
        shippingAddress: 'Helsinki',
        shippingMethod: 'pickup',
        shippingFee: 2,
      };
      await api.post('/orders', orderToCreate);
      dispatch(clearCart());
    }
    setLoading(false);
  };

  const checkAndPay = () => {
    return (
      <div className="checkout__payment">
        <div className="checkout__payment__steps">Address</div>
        <div className="checkout__payment__steps">Card</div>
        <div className="checkout__payment__steps" onClick={handleCheckout}>
          Pay
        </div>
      </div>
    );
  };

  return (
    <div className="checkout">
      {checkAndPay()}
      {loading && (
        <div className="checkout__loading">
          <div className="checkout__loading--spinner"></div>
        </div>
      )}
      <div className="checkout__checkout-view">
        <div className="checkout__checkout-view__cart">
          {itemInCart?.map((item) => (
            <SingleProduct item={item} key={item.id} />
          ))}
          <div
            className="checkout__checkout-view__cart__total"
            style={{
              color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
              backgroundColor: theme === 'dark' ? darkTheme.shadow : lightTheme.shadow,
              boxShadow: `0 0 5px 0 ${
                theme === 'dark' ? darkTheme.shadowMedium : lightTheme.shadowMedium
              }`,
            }}
          >
            <p className="checkout__checkout-view__cart__total--label">Total to pay</p>
            <p className="checkout__checkout-view__cart__total--price">$ {toPay()}</p>
          </div>
        </div>
        <div
          className="checkout__checkout-view__payment-method"
          style={{
            color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
          }}
        >
          <h1 className="checkout__checkout-view__payment-method--label">
            Select a payment method
          </h1>
          <div className="checkout__checkout-view__payment-method__card-number">
            <Input
              name="Card number"
              placeholder="Write.."
              onChange={handleCardNumber}
              value={cardNumber}
            />
            <p>cvc</p>
            <input type="text" />
          </div>
          <div className="checkout__checkout-view__payment-method__cards">
            <div className="checkout__checkout-view__payment-method__cards--card">
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
            <div className="checkout__checkout-view__payment-method__cards--card">
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
            <div className="checkout__checkout-view__payment-method__cards--card">
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
    </div>
  );
};

export default Checkout;
