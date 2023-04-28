import React, { useEffect, useRef, useState } from 'react';
import { ORDERS, OrderType, PAYMENT_DETAILS } from '../../data/orders';
import { users } from '../../data/users';
import './styles/AdminOrders.scss';

const AdminOrders = () => {
  const [orders, setOrders] = React.useState(ORDERS);
  const [providers, setProviders] = React.useState<string[] | any>();
  const [provider, setProvider] = React.useState<string | null>('');
  const [deleteFilters, setDeleteFilters] = React.useState(false);

  const maxValue = Math.max(...ORDERS.map((order) => order.totalInvoice));
  const minValue = Math.min(...ORDERS.map((order) => order.totalInvoice));
  const [inputValue, setInputValue] = useState<number | undefined>(maxValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));
  };
  const ordersRef = useRef(orders);

  useEffect(() => {
    const filtersByPaymentProvider = () => {
      const payments = ordersRef.current.map((order) => {
        const payment = PAYMENT_DETAILS.find((payment) => payment.id === order.paymentId);
        return payment?.provider;
      });

      const providers = payments.flat().filter((provider, index, self) => {
        return self.indexOf(provider) === index;
      });
      setProviders(providers);
    };
    filtersByPaymentProvider();
  }, []);

  useEffect(() => {
    const handleFilter = () => {
      const filtered = ORDERS.filter((order) => {
        const payment = PAYMENT_DETAILS.find((payment) => payment.id === order.paymentId);
        return payment?.provider === provider;
      });
      setOrders(filtered);
    };
    handleFilter();
  }, [provider]);

  useEffect(() => {
    const handleFilterByTotalInvoice = () => {
      const filtered = ordersRef.current.filter((order: OrderType) => {
        const payment = PAYMENT_DETAILS.find((payment) => payment.id === order.paymentId);
        return payment?.provider === provider && order.totalInvoice <= Number(inputValue);
      });
      setOrders(filtered);
    };
    if (inputValue !== undefined && inputValue > minValue && inputValue < maxValue) {
      handleFilterByTotalInvoice();
    }
  }, [inputValue, provider, minValue, maxValue]);

  useEffect(() => {
    const filterAllByTotalInvoice = () => {
      const filtered = ORDERS.filter((order: OrderType) => {
        return order.totalInvoice <= Number(inputValue);
      });
      setOrders(filtered);
    };
    if (!provider) {
      filterAllByTotalInvoice();
    }
  }, [inputValue, minValue, provider, maxValue]);

  const cleanFilters = () => {
    setDeleteFilters(false);
    setProvider(null);
  };
  const providersButtons = () => {
    return providers?.map((providerString: string) => (
      <button
        key={providerString}
        className="admin-orders__filters--buttons"
        onClick={() => addProvider(providerString)}
        style={{
          backgroundColor: provider === providerString ? '#000000eb' : '#ffffff',
          color: provider === providerString ? '#ffffff' : '#000000',
          border: '1px solid #343434',
        }}
      >
        {providerString}
      </button>
    ));
  };
  const addProvider = (providerString: string) => {
    setDeleteFilters(true);
    setProvider(providerString);
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
  const renderUserPayments = (paymentId: number) => {
    const payment = PAYMENT_DETAILS.find((payment) => payment.id === paymentId);
    return (
      <div
        key={payment?.provider}
        className="admin-orders__container--order--payment-methods"
      >
        <p>{payment?.provider}</p>
      </div>
    );
  };

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
      <div className="admin-orders__filters">
        {filterByTotalInvoice()}
      </div>

      <div className="admin-orders__container">
        {orders.map((order: OrderType) => (
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
                {order.items?.length}
              </span>
            </p>
            <p className="admin-orders__container--order--date">{order.orderDate}</p>
            {renderUserPayments(order.paymentId)}
          </div>
        ))}
        {!orders.length && <p>No orders less {inputValue}€ spent</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
