import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, LocalShipping, LocationCityTwoTone } from '@mui/icons-material';
import { RootState } from '../../redux/store';

import SingleProduct from '../../components/Cart/Product/SingleProduct';
import { darkTheme, lightTheme } from '../../styles/styles';
import { GlobalTheme } from '../../context/ThemeProvider';
import { api } from '../../utils/api';
import { clearCart } from '../../redux/actions/CartActions';
import './Checkout.scss';

type Item = {
  id: string;
};

const Checkout = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(false);

  const { itemInCart } = useSelector((state: RootState) => state.cart);
  const { userFromToken } = useSelector((state: RootState) => state.userLogged);

  const { theme } = GlobalTheme();
  const dispatch = useDispatch();

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

  const handleChecked = () => {
    setChecked(!checked);
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
          <h1 className="checkout__checkout-view__payment-method--label">Payment information</h1>
          <div className="checkout__checkout-view__payment-method__title">
            <h2>All shipping info goes here</h2>
          </div>
          <div className="checkout__checkout-view__payment-method__info">
            <div className="checkout__checkout-view__payment-method__info--item">
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                Address
                <LocationCityTwoTone
                  style={{
                    fontSize: '2rem',
                    marginLeft: '1rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p>Choose one address</p>
              <button>Click</button>
            </div>
            <div className="checkout__checkout-view__payment-method__info--item">
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                Card
                <CreditCard
                  style={{
                    fontSize: '2rem',
                    marginLeft: '1rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p>Choose a card</p>
              <button>Click</button>
            </div>
            <div className="checkout__checkout-view__payment-method__info--item">
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                Shipping type
                <LocalShipping
                  style={{
                    fontSize: '2rem',
                    marginLeft: '1rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p>Pick up the package or someone bring it to the door</p>
              <div className="checkout__checkout-view__payment-method__info--item__checkboxs">
                <div
                  className="checkout__checkout-view__payment-method__info--item__checkboxs__item"
                  onClick={handleChecked}
                >
                  <input type="checkbox" name="door" id="door" checked={checked} />
                  <label
                    htmlFor="door"
                    style={{
                      color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                      transform: checked ? 'scale(1.1)' : 'scale(1)',
                      fontWeight: checked ? 'bold' : 'normal',
                      marginLeft: checked ? '5px' : '0',
                    }}
                  >
                    Bring it to my door
                  </label>
                </div>
                <div
                  className="checkout__checkout-view__payment-method__info--item__checkboxs__item"
                  onClick={handleChecked}
                >
                  <input type="checkbox" name="pickup" id="pickup" checked={!checked} />
                  <label
                    htmlFor="pickup"
                    style={{
                      color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                      transform: !checked ? 'scale(1.1)' : 'scale(1)',
                      fontWeight: !checked ? 'bold' : 'normal',
                    }}
                  >
                    Pick up
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
