import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddHomeOutlined,
  CreditCard,
  LocalShipping,
  LocationCityTwoTone,
  StorefrontOutlined,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../redux/store';

import SingleProduct from '../../components/Cart/Product/SingleProduct';
import { darkTheme, lightTheme } from '../../styles/styles';
import { GlobalTheme } from '../../context/ThemeProvider';
import { clearCart } from '../../redux/actions/CartActions';
import Address from './address/Address';
import Payment from './payments/Payment';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  notifyError,
  notifyRedirectToProfile,
  notifySuccess,
  notifyWarning,
} from '../../utils/notify';
import { ToastContainer } from 'react-toastify';
import { fetchingAddresses } from '../../redux/actions/AddressAction';
import { fetchingPayments } from '../../redux/actions/PaymentAction';
import { isUserAuthenticated } from '../../utils/authentication';
import './Checkout.scss';

type Item = {
  productId: string;
  quantity: number;
};

type ItemProps = {
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
  const [allowToPay, setAllowToPay] = React.useState<boolean>(false);
  const [notEnoughStock, setNotEnoughStock] = React.useState<string[] | undefined>([]);
  const [activeAddAddress, setActiveAddAddress] = React.useState<boolean>(false);
  const [activeAddPayment, setActiveAddPayment] = React.useState<boolean>(false);

  const { userFromToken } = useSelector((state: RootState) => state.userLogged);
  const { itemInCart } = useSelector((state: RootState) => state.cart);
  const { addresses } = useSelector((state: RootState) => state.addresses);
  const { payments } = useSelector((state: RootState) => state.payments);

  const decodedUserId = JSON.parse(localStorage.getItem('user') || '{}').user_id;

  const { theme } = GlobalTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (decodedUserId) {
      dispatch(fetchingAddresses(decodedUserId));
      dispatch(fetchingPayments(decodedUserId));
    }
  }, [dispatch, decodedUserId]);

  useEffect(() => {
    setAllowToPay(false);
    if (notEnoughStock && notEnoughStock.length === 0) {
      setAllowToPay(true);
    }
  }, [notEnoughStock]);

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

  const handleStock = async () => {
    if (itemInCart?.length === 0) {
      setTimeout(() => {
        notifyError('Please add products to your cart');
      }, 1500);
    }
    if (itemInCart?.length === 0) return notifyError('You have no products in your cart');
    if (!address || !payment) return notifyError('Select address and payment first');
    setNotEnoughStock([]);
    const newArray = itemInCart?.map((item) => {
      const { id, quantity } = item;
      const productId = id;
      return {
        productId,
        quantity,
      };
    });
    try {
      newArray?.forEach(async (item: Item) => {
        const id = item.productId.slice(0,36)
        const gettingProductToCheck = await api.get(`/products/${id}`);
        if (gettingProductToCheck.data.inStock < item.quantity) {
          setNotEnoughStock((prev: any) => [...prev, gettingProductToCheck.data.id]);
          return notifyError(`${gettingProductToCheck.data.name} has not enough stock`);
        }
        if (gettingProductToCheck.data.inStock === 0) {
          return notifyError(`${gettingProductToCheck.data.name} are not available`);
        } else {
          notifySuccess(`${gettingProductToCheck.data.name} are available`);
        }
      });
    } catch (error) {
      notifyError('Something went wrong');
    }
    if (notEnoughStock && notEnoughStock?.length > 0) {
      return notifyError(`${notEnoughStock?.length} products has not enough stock`);
    } else {
      setAllowToPay(true);
    }
  };
  const updateStock = async () => {
    if (itemInCart?.length === 0) return notifyError('You have no products in your cart');
    const newArray = itemInCart?.map((item) => {
      const { id, quantity } = item;
      const productId = id;
      return {
        productId,
        quantity,
      };
    });
    newArray?.forEach(async (item: Item) => {
      const productToUpdate = {
        id: item.productId.slice(0,36),
        quantity: item.quantity,
      };
      await api.put('/products/update/stock', productToUpdate);
    });
  };

  const handleCheckout = async () => {
    if (!address || !payment) return notifyError('Select address and payment first');
    if (!allowToPay) return notifyError('Check your products stock');
    if (itemInCart?.length === 0) return notifyError('You have no products in your cart');
    setLoading(true);
    updateStock();
    const newArray = itemInCart?.map((item) => {
      const { id, variant, image, sizes, price, quantity } = item;
      const productId = id.slice(0,36);
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
      notifySuccess('Wait a moment, your order is being created');
      const idsToCreateOrder = response.data.map((item: ItemProps) => item.id);

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
    setAllowToPay(false);
    setNotEnoughStock([]);
    navigate('/home');
  };

  const checkAndPay = () => {
    return (
      <div className="checkout__payment">
        <h2>Steps</h2>
        <button
          className={!address ? 'checkout__payment__steps' : 'checkout__payment__step-disabled'}
        >
          Address
        </button>
        <button
          className={!payment ? 'checkout__payment__steps' : 'checkout__payment__step-disabled'}
        >
          Payment
        </button>
        <button
          className={
            !address || !payment ? 'checkout__payment__steps' : 'checkout__payment__step-disabled'
          }
          onClick={handleStock}
          style={{
            backgroundColor: address && payment ? 'green' : '',
          }}
        >
          {!address || !payment ? 'Checkout' : 'Continue'}
        </button>
        {notEnoughStock?.length === 0 && (
          <button
            className="checkout__payment__steps"
            onClick={handleCheckout}
            disabled={!address || !payment || !allowToPay}
          >
            Pay
          </button>
        )}
      </div>
    );
  };

  const handleChecked = () => {
    setChecked(!checked);
  };

  const handleOpenAddress = () => {
    if (!isUserAuthenticated()) return notifyWarning('Please login to provide us with your address information');
    setOpenPayments(false);
    if (addresses.length === 0) {
      setActiveAddAddress(true);
      return notifyError('Please add an address');
    }
    setOpenAddress(!openAddress);
  };

  const handleOpenCards = () => {
    if (!isUserAuthenticated()) return notifyWarning('Please login to provide us with your payment information');
    setOpenAddress(false);
    if (payments.length === 0) {
      setActiveAddPayment(true);
      return notifyError('Please add a payment method');
    }
    setOpenPayments(!openPayments);
  };

  const navigateToProfile = () => {
    notifyRedirectToProfile();
    setTimeout(() => {
      navigate('/profile');
    }, 2500);
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
            <SingleProduct item={item} key={item.id} notEnoughStock={notEnoughStock} />
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
                  <Address
                    addresses={addresses}
                    setOpenAddress={setOpenAddress}
                    setAddress={setAddress}
                  />
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
                {!address ? (
                  activeAddAddress ? (
                    <>
                      <span className="checkout__checkout-view__payment-method__info--item__text--small__text">
                        No address provided yet{' '}
                        <button
                          className="checkout__checkout-view__payment-method__info--item__text--small__text--link"
                          onClick={navigateToProfile}
                        >
                          Add it first
                        </button>
                      </span>
                    </>
                  ) : (
                    'Click to add an address'
                  )
                ) : (
                  address
                )}
              </p>
              <button
                className="checkout__checkout-view__payment-method__info--item__text--btn"
                onClick={handleOpenAddress}
              >
                Give an address
              </button>
            </div>
            <div className="checkout__checkout-view__payment-method__info--item">
              {openPayments && (
                <div className="checkout__checkout-view__payment-method__info--item__payments-view">
                  <Payment
                    payments={payments}
                    setOpenPayments={setOpenPayments}
                    setPayment={setPayment}
                  />
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
                {!payment ? (
                  activeAddPayment ? (
                    <>
                      <span className="checkout__checkout-view__payment-method__info--item__text--small__text">
                        No payment method provided yet{' '}
                        <button
                          className="checkout__checkout-view__payment-method__info--item__text--small__text--link"
                          onClick={navigateToProfile}
                        >
                          Add it first
                        </button>
                      </span>
                    </>
                  ) : (
                    'Click to add a payment method'
                  )
                ) : (
                  payment
                )}
              </p>
              <button
                className="checkout__checkout-view__payment-method__info--item__text--btn"
                onClick={handleOpenCards}
              >
                Provide a card
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
              <p
                className="checkout__checkout-view__payment-method__info--item__text--small"
                style={{
                  color: '#001e29',
                }}
              >
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
      <ToastContainer />
    </div>
  );
};

export default Checkout;
