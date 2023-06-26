import React, { useEffect } from 'react';
import moment from 'moment';
import './UserHistory.scss';
import { api } from '../../../utils/api';

type Props = {
  setOpenHistory: (opened: boolean) => void;
  history: History[] | undefined;
};

type History = {
  id: string;
  paymentType: string;
  shippingMethod: string;
  shippingAddress: string;
  shippingFee: number;
  total: number;
  createdAt: string;
  orderDetails: string[];
};
type date = {
  dateString: string;
};
type orderDetails = {
  orderDetails: any;
};

const UserHistory = ({ setOpenHistory, history }: Props) => {
  console.log('🚀 ~ file: UserHistory.tsx:10 ~ UserHistory ~ history:', history);

  const closeHistory = () => {
    setOpenHistory(false);
  };
  return (
    <div className="history">
      <button onClick={closeHistory} className="history__btn">
        Close
      </button>
      {history?.map((order: History) => (
        <div key={order.id} className="history__item">
          <div className="history__item--type">{order.paymentType}</div>
          <div className="history__item--address">Delivered in: {order.shippingAddress}</div>
          <div className="history__item--method">
            {order.shippingMethod === 'DOOR' ? 'Received at home' : 'Picked up from store'}
          </div>
          <div className="history__item--total">Total spent ${order.total}</div>
          <div className="history__item--date">
            <Date dateString={order.createdAt} />
          </div>
          <div className="history__item__details">
            <h2>Details</h2>
            <OrderDetails orderDetails={order.orderDetails} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserHistory;

const OrderDetails = ({ orderDetails }: orderDetails) => {
  console.log('🚀 ~ file: UserHistory.tsx:51 ~ OrderDetails ~ orderDetails:', orderDetails);
  // const [details, setDetails] = React.useState<any>([])
  // console.log("🚀 ~ file: UserHistory.tsx:51 ~ OrderDetails ~ details:", details)
  // React.useEffect(() => {


  useEffect(() => {
    // const request = async () => {
    //   const response = await api.get('/order-details/all-order-details', orderDetails)
    //   console.log("🚀 ~ file: UserHistory.tsx:80 ~ request ~ response:", response)

    // };
    // request();
      const enviarSolicitud = async () => {
      try {
        const params = new URLSearchParams();
        orderDetails.forEach((item: any) => params.append('orderDetailsIds', item));

        const response = await api.get('/order-details/user-order-details', { params: params });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    enviarSolicitud();
  }, [orderDetails]);

  // setDetails(request.data)
  //
  //   fetchingData()
  // }, [orderDetails])
  return (
    <div>
      {/* {orderDetails.map((item: any) => (
        <div key={item.id}>
          <div>{item.id}</div>
          <div>{item.variant}</div>
          <div>{item.image}</div>
          <div>{item.size}</div>
          <div>{item.price}</div>
          <div>{item.quantity}</div>
          <div>{item.user.id}</div>
        </div>
      ))} */}
    </div>
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
