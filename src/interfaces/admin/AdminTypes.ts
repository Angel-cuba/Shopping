import { OrderStatus } from '../profile/order/orderType';

export type AdminOrder = {
  id: string;
  orderDetails: string[];
  paymentType: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userFirstname: string;
  userLastname: string;
  userEmail: string;
  userId: string;
};

export type AdminUser = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'USER';
};
