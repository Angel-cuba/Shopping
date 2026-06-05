import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import Checkout from '../../pages/Checkout/Checkout';
import { api } from '../../utils/api';
import { toastError, toastSuccess, toastInfo } from '../../utils/toasts';
import CartReducer from '../../redux/reducers/CartReducer';
import ProductsReducer from '../../redux/reducers/ProductReducer';
import { userReducer } from '../../redux/reducers/UserReducer';
import WishReducer from '../../redux/reducers/WishesReducer';
import paymentReducer from '../../redux/reducers/PaymentReducer';
import addressReducer from '../../redux/reducers/AddressReducer';

// ── Mock prop types (erased at compile time — safe to use in jest.mock factories) ──

type CartLineItemProps = { item: { name: string }; notEnoughStock?: string[] };
type AddressProps      = { addresses: unknown[]; setAddress: (a: string) => void; setOpenAddress: (o: boolean) => void };
type MockCard          = { id: string; provider: string; cardNumber: string; cardHolderName: string; expirationDate: string; createdAt: string; updatedAt: string; paymentType: string };
type PaymentProps      = { payments: MockCard[]; setPayment: (p: MockCard) => void; setOpenPayments: (o: boolean) => void };

// ── Mocks ─────────────────────────────────────────────────────

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../utils/api', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('../../utils/toasts', () => ({
  toastError:   jest.fn(),
  toastSuccess: jest.fn(),
  toastInfo:    jest.fn(),
  toastDelete:  jest.fn(),
}));

jest.mock('../../components/Cart/CartLineItem', () => ({
  __esModule: true,
  default: (props: CartLineItemProps) => (
    <div data-testid="cart-line-item">{props.item.name}</div>
  ),
}));

// Address mock: immediately selects the first address on click
jest.mock('../../pages/Checkout/address/Address', () => ({
  __esModule: true,
  default: (props: AddressProps) => (
    <button
      data-testid="pick-address"
      onClick={() => { props.setAddress('123 Main St, New York'); props.setOpenAddress(false); }}
    >
      Pick Address
    </button>
  ),
}));

// Payment mock: immediately selects a card on click
jest.mock('../../pages/Checkout/payments/Payment', () => ({
  __esModule: true,
  default: (props: PaymentProps) => (
    <button
      data-testid="pick-payment"
      onClick={() => {
        props.setPayment({
          id: 'pay1',
          provider: 'Visa',
          cardNumber: '4242424242424242',
          cardHolderName: 'Test User',
          expirationDate: '12/25',
          createdAt: '',
          updatedAt: '',
          paymentType: 'CREDIT',
        });
        props.setOpenPayments(false);
      }}
    >
      Pick Payment
    </button>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────

const PRODUCT_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const CART_ITEM_ID  = PRODUCT_UUID + '1700000000000';

const mockCartItem = {
  id:          CART_ITEM_ID,
  name:        'Air Max 90',
  price:       99,
  description: 'Comfort shoe',
  image:       'img.png',
  categories:  'Summer',
  variant:     'Red',
  sizes:       '9',
  quantity:    2,
  stock:       10,
};

const mockDecodedUser = {
  role:     'USER',
  user_id:  'user-uuid-1',
  username: 'testuser',
  sub:      'sub-1',
  iat:      0,
  exp:      9999999999,
};

const mockAddress = {
  id:         'addr-1',
  address:    '123 Main St',
  city:       'New York',
  country:    'US',
  postalCode: '10001',
  createdAt:  '',
  updatedAt:  '',
};

const mockPayment = {
  id:             'pay1',
  provider:       'Visa',
  cardNumber:     '4242424242424242',
  cardHolderName: 'Test User',
  expirationDate: '12/25',
  createdAt:      '',
  updatedAt:      '',
  paymentType:    'CREDIT',
};

function makeStore(overrides: Record<string, unknown> = {}) {
  return configureStore({
    reducer: {
      cart:       CartReducer,
      products:   ProductsReducer,
      userLogged: userReducer,
      wishes:     WishReducer,
      payments:   paymentReducer,
      addresses:  addressReducer,
    },
    preloadedState: {
      cart:       { itemInCart: [mockCartItem] },
      userLogged: { user: null, userFromToken: mockDecodedUser },
      addresses:  { addresses: [mockAddress], loading: false, error: null, success: false },
      payments:   { payments: [mockPayment],  loading: false, error: null, success: false },
      ...overrides,
    } as Parameters<typeof configureStore>[0]['preloadedState'],
  });
}

function renderCheckout(store = makeStore()) {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    </Provider>
  );
}

// Helper: go through full happy path up to stock-checked state
async function selectAddressAndPayment() {
  // Open address panel and pick
  userEvent.click(screen.getAllByText('Select')[0]);
  await screen.findByTestId('pick-address');
  userEvent.click(screen.getByTestId('pick-address'));

  // Open payment panel and pick
  await waitFor(() => expect(screen.queryByTestId('pick-address')).not.toBeInTheDocument());
  userEvent.click(screen.getByText('Select'));
  await screen.findByTestId('pick-payment');
  userEvent.click(screen.getByTestId('pick-payment'));
  await waitFor(() => expect(screen.queryByTestId('pick-payment')).not.toBeInTheDocument());
}

// ── Tests ─────────────────────────────────────────────────────

describe('Checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Empty cart ──────────────────────────────────────────────

  it('renders empty-cart state when cart is empty', () => {
    const store = makeStore({ cart: { itemInCart: [] } });
    renderCheckout(store);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Browse products')).toBeInTheDocument();
    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });

  // ── Checkout UI ─────────────────────────────────────────────

  it('renders checkout form with step bar, section cards and order summary', () => {
    renderCheckout();

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Delivery address')).toBeInTheDocument();
    expect(screen.getByText('Payment method')).toBeInTheDocument();
    expect(screen.getByText('Shipping method')).toBeInTheDocument();
    expect(screen.getByText('Order summary')).toBeInTheDocument();
    expect(screen.getByTestId('cart-line-item')).toBeInTheDocument();
  });

  it('Place order button is disabled before address, payment and stock check', () => {
    renderCheckout();
    const btn = screen.getByText('Place order');
    expect(btn).toBeDisabled();
  });

  // ── Address guard ───────────────────────────────────────────

  it('shows error toast when trying to open address panel with no saved addresses', async () => {
    const store = makeStore({
      addresses: { addresses: [], loading: false, error: null, success: false },
    });
    renderCheckout(store);

    userEvent.click(screen.getAllByText('Select')[0]);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('address'));
    });
  });

  // ── Stock check ─────────────────────────────────────────────

  it('stock check — success: enables Place order and shows in-stock toast', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 10 },
    });

    renderCheckout();
    await selectAddressAndPayment();

    userEvent.click(screen.getByText(/Check stock availability/i));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/products/${PRODUCT_UUID}`);
      expect(toastSuccess).toHaveBeenCalledWith(expect.stringContaining('in stock'));
    });

    expect(screen.getByText('Place order')).not.toBeDisabled();
  });

  it('stock check — insufficient stock: shows error toast and keeps Place order disabled', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 1 }, // cart wants 2
    });

    renderCheckout();
    await selectAddressAndPayment();

    userEvent.click(screen.getByText(/Check stock availability/i));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('Air Max 90'));
    });

    expect(screen.getByText('Place order')).toBeDisabled();
  });

  // ── Place order ─────────────────────────────────────────────

  it('happy path: calls POST /orders/place with correct payload and navigates to /history', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 10 },
    });
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    renderCheckout();
    await selectAddressAndPayment();

    userEvent.click(screen.getByText(/Check stock availability/i));
    await waitFor(() => expect(screen.getByText('Place order')).not.toBeDisabled());

    userEvent.click(screen.getByText('Place order'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/orders/place', expect.objectContaining({
        userId:          'user-uuid-1',
        paymentType:     'Visa',
        shippingAddress: '123 Main St, New York',
        shippingMethod:  'DOOR',
        items: [expect.objectContaining({
          productId: PRODUCT_UUID,
          quantity:  2,
        })],
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/history');
    });
  });

  it('shows "out of stock" toast when backend returns 409', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 10 },
    });
    (api.post as jest.Mock).mockRejectedValue({ response: { status: 409 } });

    renderCheckout();
    await selectAddressAndPayment();

    userEvent.click(screen.getByText(/Check stock availability/i));
    await waitFor(() => expect(screen.getByText('Place order')).not.toBeDisabled());

    userEvent.click(screen.getByText('Place order'));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('out of stock'));
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows generic error toast when backend returns 500', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 10 },
    });
    (api.post as jest.Mock).mockRejectedValue({ response: { status: 500 } });

    renderCheckout();
    await selectAddressAndPayment();

    userEvent.click(screen.getByText(/Check stock availability/i));
    await waitFor(() => expect(screen.getByText('Place order')).not.toBeDisabled());

    userEvent.click(screen.getByText('Place order'));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('went wrong'));
    });
  });

  // ── Session guard ───────────────────────────────────────────

  it('shows session-expired toast when userFromToken is null', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: PRODUCT_UUID, name: 'Air Max 90', inStock: 10 },
    });

    const store = makeStore({
      userLogged: { user: null, userFromToken: null },
    });
    renderCheckout(store);

    // Directly click Place order — guards fire because no address/payment
    // but we should see session error (first guard)
    // Since no user, the address "Select" guard fires first with "Please log in"
    userEvent.click(screen.getAllByText('Select')[0]);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('log in'));
    });
  });
});
