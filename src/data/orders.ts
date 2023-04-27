export type OrderType = {
  orderId: number;
  userId: number;
  paymentId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  totalInvoice: number;
  orderDate?: string;
};

export type PaymentsType = {
  id: number;
  provider: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type OrderByUserType = {
  orderId: number;
  products: {
    productId: number;
    quantity: number;
  }[];
  quantity: number;
  createdAt: string;
  modifiedAt: string;
};

export const ORDERS: OrderType[] = [
  {
    orderId: 1,
    userId: 1,
    paymentId:  9,
    items: [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 1,
      },
    ],
    totalInvoice: 100,
    orderDate: '2021-01-01',
  },
  {
    orderId: 2,
    userId: 2,
    paymentId: 2,
    items: [
      {
        productId: 2,
        quantity: 2,
      },
      {
        productId: 3,
        quantity: 1,
      },
    ],
    totalInvoice: 23,
    orderDate: '2021-01-02',
  },
  {
    orderId: 3,
    userId: 3,
    paymentId: 4,
    items: [
      {
        productId: 4,
        quantity: 1,
      },
    ],
    totalInvoice: 123,
    orderDate: '2021-01-03',
  },
  {
    orderId: 4,
    userId: 4,
    paymentId: 7,
    items: [
      {
        productId: 4,
        quantity: 1,
      },
      {
        productId: 5,
        quantity: 1,
      },
    ],
    totalInvoice: 155,
    orderDate: '2021-01-04',
  },
  {
    orderId: 14,
    userId: 6,
    paymentId: 7,
    items: [
      {
        productId: 4,
        quantity: 1,
      },
      {
        productId: 5,
        quantity: 1,
      },
    ],
    totalInvoice: 55,
    orderDate: '2021-01-04',
  },
  {
    orderId: 6,
    userId: 4,
    paymentId: 7,
    items: [
      {
        productId: 4,
        quantity: 1,
      },
      {
        productId: 5,
        quantity: 1,
      },
    ],
    totalInvoice: 55,
    orderDate: '2021-01-04',
  },
  {
    orderId: 7,
    userId: 8,
    paymentId: 6,
    items: [
      {
        productId: 5,
        quantity: 1,
      },
    ],
    totalInvoice: 55,
    orderDate: '2021-01-04',
  },
  {
    orderId: 8,
    userId: 2,
    paymentId: 1,
    items: [
      {
        productId: 4,
        quantity: 1,
      },
      {
        productId: 5,
        quantity: 1,
      },
    ],
    totalInvoice: 55,
    orderDate: '2021-01-04',
  },
];

export const PAYMENT_DETAILS: PaymentsType[] = [
  {
    id: 1,
    provider: 'Paypal',
    status: false,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 2,
    provider: 'Stripe',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 3,
    provider: 'Apple Pay',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 4,
    provider: 'Google Pay',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 5,
    provider: 'Amazon Pay',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 6,
    provider: 'Samsung Pay',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 7,
    provider: 'Visa',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 8,
    provider: 'Mastercard',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
  {
    id: 9,
    provider: 'American Express',
    status: true,
    createdAt: '01/01/2020',
    updatedAt: '01/01/2020',
  },
];

export const ORDERS_BY_USER: OrderByUserType[] = [
  {
    orderId: 1,
    products: [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 1,
      },
    ],
    quantity: 100,
    createdAt: '2021-01-01',
    modifiedAt: '2021-01-01',
  },
]
