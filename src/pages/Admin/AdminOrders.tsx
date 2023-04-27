import React, { useEffect, useRef, useState } from 'react';
import { ORDERS, PAYMENT_DETAILS } from '../../data/orders';
import { users } from '../../data/users';
import './styles/AdminOrders.scss';

const AdminOrders = () => {
  const [orders, setOrders] = React.useState(ORDERS);
  const [providers, setProviders] = React.useState<string[] | any>();
  const [deleteFilters, setDeleteFilters] = React.useState(false);

  const maxValue = Math.max(...ORDERS.map((order) => order.totalInvoice));
  const minValue = Math.min(...ORDERS.map((order) => order.totalInvoice));
  const [inputValue, setInputValue] = useState<number | undefined>(maxValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));
  };
  const ordersRef = useRef(orders);

  useEffect(() => {
    if (ordersRef.current.length) {
      const filtersByPaymentProvider = () => {
        const payments = ordersRef.current.map((order) => {
          const payment = PAYMENT_DETAILS.find((payment) => payment.id === order.paymentId);
          return payment?.provider;
        });

        const provider = payments.flat().filter((provider, index, self) => {
          return self.indexOf(provider) === index;
        });
        setProviders(provider);
      };
      filtersByPaymentProvider();
    }
  }, []);

  const renderUserPayments = (paymentId: number) => {
      const payment = PAYMENT_DETAILS.find((payment) => payment.id === paymentId);
      return (
        <div
          key={payment?.id}
          style={{
            backgroundColor:  'green',
            textAlign: 'center',
          }}
          className="admin-orders__container--order--payment-methods"
        >
          <p>{payment?.provider}</p>
        </div>
      );
  };

  const userInfo = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return (
      <div key={user?.id} className="admin-orders__container--order--user-info">
        <img
          src={user?.picture}
          alt={user?.name}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
          }}
        />

        <p className="admin-orders__container--order--user-info--name">{user?.name}</p>
      </div>
    );
  };
  const handleFilter = (provider: string) => {
    const filteredOrders = ORDERS.filter((order) => {
      const payment = PAYMENT_DETAILS.find((payment) => payment.id === order.paymentId);
      return payment?.provider === provider;
    });
    setDeleteFilters(true);
    setOrders(filteredOrders);
  };
  const filterByTotalInvoice = () => {
    return (
      <div className="admin-orders__filters--buttons">
        <input
          type="range"
          value={inputValue}
          onChange={handleInputChange}
          min={minValue}
          max={maxValue}
        />
      </div>
    );
  };
  const cleanFilters = () => {
    setDeleteFilters(false);
    setOrders(ORDERS);
  };
  const providersButtons = () => {
    return providers?.map((provider: string) => (
      <button
        key={provider}
        className="admin-orders__filters--buttons"
        onClick={() => handleFilter(provider)}
      >
        {provider}
      </button>
    ));
  };

  useEffect(() => {
    const handleFilterByTotalInvoice = () => {
      const filteredOrders = ORDERS.filter((order) => {
        return order.totalInvoice <= Number(inputValue);
      });
      setOrders(filteredOrders);
    };
    if (inputValue !== undefined && inputValue !== 0) {
      handleFilterByTotalInvoice();
    }
  }, [inputValue]);

  return (
    <div className="admin-orders">
      {deleteFilters && (
        <div className="admin-orders__close-filters">
          <p className="admin-orders__close-filters--text" onClick={cleanFilters}>
            Clean filters
          </p>
        </div>
      )}
      <div className="admin-orders__filters">{providersButtons()}</div>
      <div className="admin-orders__filters">{filterByTotalInvoice()}</div>
      <div className="admin-orders__container">
        {orders.map((order) => (
          <div key={order.orderId} className="admin-orders__container--order">
            {userInfo(order.userId)}
            <p className="admin-orders__container--order--information">
              Total spent:
              <span className="admin-orders__container--order--information--number">
                {order.totalInvoice} €
              </span>
            </p>
            <p className="admin-orders__container--order--information">
              Amount of products:
              <span className="admin-orders__container--order--information--number">
                {order.items.length}
              </span>
            </p>
            <p className="admin-orders__container--order--date">{order.orderDate}</p>
            {renderUserPayments(order.paymentId)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
