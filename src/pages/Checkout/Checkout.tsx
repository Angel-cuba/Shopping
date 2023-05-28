import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddHomeOutlined, CreditCard, LocalShipping, LocationCityTwoTone, StorefrontOutlined } from '@mui/icons-material';
import { RootState } from '../../redux/store';

import SingleProduct from '../../components/Cart/Product/SingleProduct';
import { darkTheme, lightTheme } from '../../styles/styles';
import { GlobalTheme } from '../../context/ThemeProvider';
import { clearCart } from '../../redux/actions/CartActions';
import Address from './address/Address';
import Payment from './payments/Payment';
import { api } from '../../utils/api';
import './Checkout.scss';

type Item = {
  id: string;
};

const Checkout = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(true);
  const [openAddress, setOpenAddress] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>('');
  const [openPayments, setOpenPayments] = React.useState<boolean>(false);
  const [payment, setPayment] = React.useState<string>('');
  const [totalToPay, setTotalToPay] = React.useState<number>(0);

  const { userFromToken } = useSelector((state: RootState) => state.userLogged);
  const { itemInCart } = useSelector((state: RootState) => state.cart);
  const { addresses } = useSelector((state: RootState) => state.addresses);
  const { payments } = useSelector((state: RootState) => state.payments);

  const { theme } = GlobalTheme();
  const dispatch = useDispatch();

  useEffect(() => {
  const toPay = () => {
    let total = 0;
    itemInCart?.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalToPay(total);
  };
    toPay();
  }, [itemInCart]);

  
  const handleCheckout = async () => {
    if(!address || !payment) return alert('Please select address and payment method');
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
        paymentType: payment,
        shippingAddress: address,
        shippingMethod: checked ? 'DOOR' : 'PICKUP',
        shippingFee: checked ? 2.99 : 0,
        total: totalToPay,
      };
      await api.post('/orders', orderToCreate);
      dispatch(clearCart());
    }
    setAddress('');
    setPayment('');
    setLoading(false);
  };

  const checkAndPay = () => {
    return (
      <div className="checkout__payment">
        <h2>Steps</h2>
        <button className={!address ? "checkout__payment__steps" : "checkout__payment__step-disabled"}>Address</button>
        <button className={!payment ? "checkout__payment__steps" : "checkout__payment__step-disabled"}>Payment</button>
        <button className="checkout__payment__steps" onClick={handleCheckout}>
          Pay
        </button>
      </div>
    );
  };

  const handleChecked = () => {
    setChecked(!checked);
  };

  const handleOpenAddress = () => {
    setOpenPayments(false);
    setOpenAddress(!openAddress);
  };

  const handleOpenCards = () => {
    setOpenAddress(false);
    setOpenPayments(!openPayments);
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
              boxShadow: `-1px 0 5px -1px ${
                theme === 'dark' ? darkTheme.shadowMedium : lightTheme.shadowMedium
              }`,
            }}
          >
            <p className="checkout__checkout-view__cart__total--label">Total to pay</p>
            <p className="checkout__checkout-view__cart__total--price">$ {totalToPay}</p>

          </div>
        </div>
        <div
          className="checkout__checkout-view__payment-method"
          style={{
            color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
          }}
        >
          <div className="checkout__checkout-view__payment-method__info">
            <div className="checkout__checkout-view__payment-method__info--item">
              {openAddress && (
                <div className="checkout__checkout-view__payment-method__info--item__address-view">
                  <Address addresses={addresses} setOpenAddress={setOpenAddress} setAddress={setAddress}/>
                </div>
              )}
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                <LocationCityTwoTone
                  style={{
                    fontSize: '2rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p className="checkout__checkout-view__payment-method__info--item__text--small">
                {
                  !address ? 'Click to add address' : address
                }
              </p>
              <button
                className="checkout__checkout-view__payment-method__info--item__text--btn"
                onClick={handleOpenAddress}
              >
                Click
              </button>
            </div>
            <div className="checkout__checkout-view__payment-method__info--item">
              {openPayments && (
                <div className="checkout__checkout-view__payment-method__info--item__payments-view">
                  <Payment payments={payments} setOpenPayments={setOpenPayments} setPayment={setPayment}/>
                </div>
              )}
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                <CreditCard
                  style={{
                    fontSize: '2rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p className="checkout__checkout-view__payment-method__info--item__text--small">
                {
                  !payment ? 'Click to add card' : payment
                }
              </p>
              <button
                className="checkout__checkout-view__payment-method__info--item__text--btn"
                onClick={handleOpenCards}
              >
                Click
              </button>
            </div>
            <div className="checkout__checkout-view__payment-method__info--item">
              <h3 className="checkout__checkout-view__payment-method__info--item__text">
                Shipping method
                <LocalShipping
                  style={{
                    fontSize: '2rem',
                    marginLeft: '1rem',
                    color: theme === 'dark' ? lightTheme.textLink : darkTheme.textLink,
                  }}
                />
              </h3>
              <p className="checkout__checkout-view__payment-method__info--item__text--small" style={{
                color: '#001e29'
              }}>
                {checked ? <AddHomeOutlined /> : <StorefrontOutlined />}
                <span className="checkout__checkout-view__payment-method__info--item__text--small--label">
                  {checked ? 'At home' : 'Posti'}
                </span>
              </p>
              <div className="checkout__checkout-view__payment-method__info--item__checkboxs">
                <div className="checkout__checkout-view__payment-method__info--item__checkboxs__item">
                  <input
                    type="checkbox"
                    name="door"
                    id="door"
                    checked={checked}
                    onChange={handleChecked}
                  />
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
                <div className="checkout__checkout-view__payment-method__info--item__checkboxs__item">
                  <input
                    type="checkbox"
                    name="pickup"
                    id="pickup"
                    checked={!checked}
                    onChange={handleChecked}
                  />
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
