import React, { useEffect } from 'react';

type Props = {
  setOpenHistory: (opened: boolean) => void;
  history: any;
};

const UserHistory = ({ setOpenHistory, history }: Props) => {
  // console.log("🚀 ~ file: UserHistory.tsx:10 ~ UserHistory ~ history:", history)

  const closeHistory = () => {
    setOpenHistory(false);
  };
  return (
    <div className="history">
      <button onClick={closeHistory}>Close</button>
      {history?.map((order: any) => (
        <div key={order.id}>
          <div>{order.id}</div>
          <div>{order.createdAt}</div>
          <div>{order.paymentType}</div>
          <div>{order.shippingAddress}</div>
          <div>{order.shippingMethod}</div>
          <div>{order.shippingFee}</div>
          <div>{order.totalPrice}</div>
          {/* <div>{order.orderDetails.map((item: any) => (
              <div key={item.id}>
                <div>{item.id}</div>
                <div>{item.variant}</div>
                <div>{item.image}</div>
                <div>{item.size}</div>
                <div>{item.price}</div>
                <div>{item.quantity}</div>
                <div>{item.user.id}</div>
              </div>
            ))}</div> */}
          <OrderDetails orderDetails={order.orderDetails} />
        </div>
      ))}
    </div>
  );
};

export default UserHistory;

const OrderDetails = ({ orderDetails }: any) => {
  console.log('🚀 ~ file: UserHistory.tsx:51 ~ OrderDetails ~ orderDetails:', orderDetails);
  // const [details, setDetails] = React.useState<any>([])
  // console.log("🚀 ~ file: UserHistory.tsx:51 ~ OrderDetails ~ details:", details)
  // React.useEffect(() => {

  // const fetchingData = async () => {
  useEffect(() => {
    const request = async () => {
      const response = await fetch(`/order-details/user/?orderDetailsIds=[${orderDetails}]`);
      const data = await response.json();
      console.log('🚀 ~ file: UserHistory.tsx:61 ~ request ~ response:', response);
      console.log('🚀 ~ file: UserHistory.tsx:61 ~ fetchingData ~ data:', data);
    };
    request();
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
