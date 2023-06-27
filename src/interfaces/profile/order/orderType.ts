export type History = {
  id: string;
  paymentType: string;
  shippingMethod: string;
  shippingAddress: string;
  shippingFee: number;
  total: number;
  createdAt: string;
  orderDetails: string[];
};
export type date = {
  dateString: string;
};
export type orderDetails = {
  orderDetails: string[];
};

export type orderDetailsItem = {
  id: string
  image: string
  price: number
  productId: string
  quantity: number
  size: string
  variant: string
}
