import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { api } from '../../../utils/api';
import { notifyError } from '../../../utils/notify';
import {
  History,
  date,
  orderDetails,
  orderDetailsItem,
} from '../../../interfaces/profile/order/orderType';
import './UserHistory.scss';

const UserHistory = () => {
  const [history, setHistory] = useState<[]>();

  const decodedUserId = JSON.parse(localStorage.getItem('decodedUser') || '{}').user_id;

  useEffect(() => {
    const handleOpenHistory = async () => {
      const requestHistory = await api.get(`/orders/${decodedUserId}`);
      setHistory(requestHistory.data);
    };
    handleOpenHistory();
  }, [decodedUserId]);
  return (
    <div className="container">
      <div className="content">
      </div>
      <div className="history">
        {history?.map((order: History) => (
          <div key={order.id} className="history__items">
            <div className="history__items__shipping">
              <div className="history__items__shipping--type">{order.paymentType}</div>
              <div className="history__items__shipping--address">
                Delivered in: {order.shippingAddress}
              </div>
              <div className="history__items__shipping--method">
                {order.shippingMethod === 'DOOR' ? 'Received at home' : 'Picked up from store'}
              </div>
              <div className="history__items--total">Total spent ${order.total}</div>
            </div>
            <div className="history__items--date">
              <Date dateString={order.createdAt} />
            </div>
            <div className="history__items__details">
              <OrderDetails orderDetails={order.orderDetails} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;

const OrderDetails = ({ orderDetails }: orderDetails) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const orderDetailsRequest = async () => {
      try {
        const params = new URLSearchParams();
        orderDetails.forEach((item: any) => params.append('orderDetailsIds', item));

        const response = await api.get('/order-details/all-order-details', {
          params: {
            orderDetailsIds: orderDetails.join(','),
          },
        });
        setItems(response.data);
      } catch (error) {
        notifyError('Something went wrong, try later');
      }
    };

    orderDetailsRequest();
  }, [orderDetails]);

  return (
    <>
      {items.map((item: orderDetailsItem) => (
        <div key={item.id} className="history__items__details__item">
          <div
            style={{ backgroundColor: `${item.variant}`, boxShadow: `0 0 2px 0 ${item.variant}` }}
            className="history__items__details__item--variant"
          ></div>
          <div className="history__items__details__item--img">
            <img
              src={item.image}
              alt={item.variant}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div className="history__items__details__item__info">
            <p className="history__items__details__item__info--size">{item.size}</p>
            <p className="history__items__details__item__info--price">$ {item.price}</p>
            <p className="history__items__details__item__info--quantity">{item.quantity}</p>
          </div>
        </div>
      ))}
    </>
  );
};

const Date = ({ dateString }: date) => {
  const date = moment(dateString);
  const dayOfWeek = date.format('dddd');
  const formattedDate = date.format('YYYY-MM-DD');
  const time = date.format('HH:mm:ss');

  return (
    <>
      {dayOfWeek}, {formattedDate} at {time}
    </>
  );
};
