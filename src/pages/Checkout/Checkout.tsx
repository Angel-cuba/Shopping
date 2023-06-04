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
import { notifyError, notifyRedirectToProfile } from '../../utils/notify';
import { ToastContainer } from 'react-toastify';
import { fetchingAddresses } from '../../redux/actions/AddressAction';
import { fetchingPayments } from '../../redux/actions/PaymentAction';
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
    if(itemInCart?.length === 0){
      setTimeout(() => {
        notifyError('Please add products to your cart');
      }
      , 1500);
    }
    if(itemInCart?.length === 0) return notifyError('You have no products in your cart');
    if(!address || !payment) return notifyError('Select address and payment first');
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
      //TODO: Add spinners or something to show the user that the app is checking the stock
      newArray?.forEach(async (item: Item) => {
        const gettingProductToCheck = await api.get(`/products/${item.productId}`);
        if (gettingProductToCheck.data.inStock < item.quantity) {
          setNotEnoughStock((prev: any) => [...prev, gettingProductToCheck.data.id]);
          //TODO: Add warning message to the user that the product has not enough stock
          return console.log(`${gettingProductToCheck.data.name} has not enough stock`);
        }
        //TODO: Cambiar todos los alerts por una notificacion
        if (gettingProductToCheck.data.inStock === 0) {
          return alert(`${gettingProductToCheck.data.name} is out of stock`);
        } else {
          console.log(`${gettingProductToCheck.data.name} are available`);
        }
      });
    } catch (error) {
      console.log(error);
    }
    if (notEnoughStock && notEnoughStock?.length > 0) {
      return alert(`${notEnoughStock?.length} products has not enough stock`);
    } else {
      setAllowToPay(true);
    }
  };
  const updateStock = async () => {
    //TODO: Add warning message
    if (itemInCart?.length === 0) return alert('Your cart is empty');
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
        id: item.productId,
        quantity: item.quantity,
      };
      await api.put('/products/update/stock', productToUpdate);
    });
  };

  const handleCheckout = async () => {
    if (!address || !payment) return alert('Please select address and payment method');
    setLoading(true);
    updateStock();
    //TODO: Another spinning or loading
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
    //TODO: Send a notification to show that the order is starting to be created
    const response = await api.post('/order-details/create-order-details', newArray);
    if (response.status === 200) {
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
    //TODO Send a notification to show that the order was created and redirect to home
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
          //TODO: Add different background color when the user can pay
          className={
            !address || !payment ? 'checkout__payment__steps' : 'checkout__payment__step-disabled'
          }
          onClick={handleStock}
          style={{
            backgroundColor: address && payment ? 'green' : 'red',
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
    setOpenPayments(false);
    if (addresses.length === 0) {
      setActiveAddAddress(true);
      return notifyError('Please add an address');
    }
    setOpenAddress(!openAddress);
  };

  const handleOpenCards = () => {
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
