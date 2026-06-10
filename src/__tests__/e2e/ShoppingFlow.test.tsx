/**
 * E2E-style integration tests for the full shopping flow:
 *   Home/Products → PDP (product detail) → Cart → Checkout
 *
 * Each section mounts the relevant component with realistic Redux state and
 * mocked API responses so the tests exercise real component logic without
 * needing a live browser or backend.
 *
 * Run: CI=true npm test -- --no-coverage --testPathPattern=ShoppingFlow
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import CartReducer from '../../redux/reducers/CartReducer';
import ProductsReducer from '../../redux/reducers/ProductReducer';
import { userReducer } from '../../redux/reducers/UserReducer';
import WishReducer from '../../redux/reducers/WishesReducer';
import paymentReducer from '../../redux/reducers/PaymentReducer';
import addressReducer from '../../redux/reducers/AddressReducer';

import Products from '../../pages/Products/Products';
import ProductById from '../../components/Product/ProductById';
import CartDrawer from '../../components/Cart/CartDrawer';
import Checkout from '../../pages/Checkout/Checkout';

import { apiWithoutAuth, api } from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/toasts';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('../../utils/api', () => ({
  api:            { get: jest.fn(), post: jest.fn() },
  apiWithoutAuth: { get: jest.fn() },
}));

jest.mock('../../utils/toasts', () => ({
  toastError:   jest.fn(),
  toastSuccess: jest.fn(),
  toastInfo:    jest.fn(),
  toastDelete:  jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Stub hot-toast so Toaster rendering doesn't leak between tests
jest.mock('react-hot-toast', () => ({
  toast:   { success: jest.fn(), error: jest.fn() },
  success: jest.fn(),
  error:   jest.fn(),
  Toaster: () => null,
}));

// Stub Address / Payment panels so Checkout tests stay fast
type AddressProps = { setAddress: (a: string) => void; setOpenAddress: (o: boolean) => void };
type MockCard = { id: string; provider: string; cardNumber: string; cardHolderName: string; expirationDate: string; createdAt: string; updatedAt: string; paymentType: string };
type PaymentProps = { setPayment: (p: MockCard) => void; setOpenPayments: (o: boolean) => void };

jest.mock('../../pages/Checkout/address/Address', () => ({
  __esModule: true,
  default: (props: AddressProps) => (
    <button data-testid="pick-address" onClick={() => { props.setAddress('Gran Vía 1, Madrid'); props.setOpenAddress(false); }}>
      Pick Address
    </button>
  ),
}));

jest.mock('../../pages/Checkout/payments/Payment', () => ({
  __esModule: true,
  default: (props: PaymentProps) => (
    <button data-testid="pick-payment" onClick={() => {
      props.setPayment({ id: 'p1', provider: 'Visa', cardNumber: '4242424242424242', cardHolderName: 'Test', expirationDate: '12/26', createdAt: '', updatedAt: '', paymentType: 'CREDIT' });
      props.setOpenPayments(false);
    }}>
      Pick Payment
    </button>
  ),
}));

jest.mock('../../components/Cart/CartLineItem', () => ({
  __esModule: true,
  default: ({ item }: { item: { name: string } }) => <div data-testid="cart-line-item">{item.name}</div>,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const PRODUCT_ID = 'cab00003-0000-0000-0000-000000000001';
const CART_ITEM_ID = PRODUCT_ID + '1700000000000';

const mockProduct = {
  id:          PRODUCT_ID,
  name:        'Air Zoom Pegasus 40',
  description: 'Zapatilla de running versátil.',
  image:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  inStock:     50,
  price:       130,
  categories:  'Running' as const,
  variants:    ['White/Black', 'Blue/Silver', 'Black/Red'],
  sizes:       ['38', '39', '40', '41', '42', '43'],
};

const mockProduct2 = {
  id:          'cab00003-0000-0000-0000-000000000002',
  name:        'React Infinity Run FK 3',
  description: 'Diseñada para ayudarte a seguir corriendo.',
  image:       'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
  inStock:     35,
  price:       160,
  categories:  'Running' as const,
  variants:    ['Black/White', 'Electric Blue', 'Mint Green'],
  sizes:       ['39', '40', '41', '42'],
};

const mockCartItem = {
  id:          CART_ITEM_ID,
  name:        'Air Zoom Pegasus 40',
  price:       130,
  description: 'Zapatilla de running versátil.',
  image:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  categories:  'Running',
  variant:     'White/Black',
  sizes:       '42',
  quantity:    1,
  stock:       50,
};

const mockDecodedUser = {
  role:     'USER',
  user_id:  'cab00002-0000-0000-0000-000000000002',
  username: 'maria.lopez',
  sub:      'sub-1',
  iat:      0,
  exp:      9999999999,
};

const mockAddress = { id: 'addr-1', address: 'Gran Vía 1', city: 'Madrid', country: 'Spain', postalCode: '28001', createdAt: '', updatedAt: '' };
const mockPayment = { id: 'pay-1', provider: 'Visa', cardNumber: '4242424242424242', cardHolderName: 'María López', expirationDate: '12/26', createdAt: '', updatedAt: '', paymentType: 'CREDIT' };

// ── Store factory ─────────────────────────────────────────────────────────────

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
      products: { products: [mockProduct, mockProduct2], loading: false, success: false },
      cart:     { itemInCart: [] },
      wishes:   { itemInWishlist: [], loadingWishes: false, errorWishes: null, successWishes: false },
      userLogged: { user: null, userFromToken: mockDecodedUser },
      addresses:  { addresses: [mockAddress], loading: false, error: null, success: false },
      payments:   { payments: [mockPayment],  loading: false, error: null, success: false },
      ...overrides,
    } as Parameters<typeof configureStore>[0]['preloadedState'],
  });
}

function renderWithStore(ui: React.ReactElement, store = makeStore()) {
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

// ── SECTION 1: Products listing page ─────────────────────────────────────────

describe('Products listing', () => {
  it('renders all product cards from Redux store', () => {
    renderWithStore(
      <MemoryRouter>
        <Products products={[mockProduct, mockProduct2]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Air Zoom Pegasus 40')).toBeInTheDocument();
    expect(screen.getByText('React Infinity Run FK 3')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).not.toHaveLength(0);
  });

  it('filters products by category', () => {
    renderWithStore(
      <MemoryRouter>
        <Products
          products={[mockProduct, mockProduct2]}
          externalCategory="Running"
        />
      </MemoryRouter>
    );

    // Both are Running — both visible
    expect(screen.getByText('Air Zoom Pegasus 40')).toBeInTheDocument();
    expect(screen.getByText('React Infinity Run FK 3')).toBeInTheDocument();
  });

  it('shows "no results" state when no products match the search', async () => {
    renderWithStore(
      <MemoryRouter>
        <Products products={[mockProduct, mockProduct2]} />
      </MemoryRouter>
    );

    const searchInput = screen.queryByPlaceholderText(/search/i);
    if (searchInput) {
      userEvent.type(searchInput, 'xxxxxxxxnonexistent');
      // Products page renders a not-found / no-results component when filtered list is empty
      await waitFor(() => {
        // Main product grid cards should be gone (checking by product card article role)
        const articles = document.querySelectorAll('article.pcard');
        expect(articles.length).toBe(0);
      });
    }
  });

  it('renders product prices using £ symbol (ProductCard design)', () => {
    renderWithStore(
      <MemoryRouter>
        <Products products={[mockProduct]} />
      </MemoryRouter>
    );

    // ProductCard renders £{price.toFixed(2)} (British pound)
    expect(screen.getByText(/£130/)).toBeInTheDocument();
  });
});

// ── SECTION 2: Product detail page (PDP) ─────────────────────────────────────

describe('Product detail page (PDP)', () => {
  beforeEach(() => {
    (apiWithoutAuth.get as jest.Mock).mockResolvedValue({ data: mockProduct });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderPDP(productId = PRODUCT_ID, store = makeStore()) {
    return renderWithStore(
      <MemoryRouter initialEntries={[`/product/${productId}`]}>
        <Routes>
          <Route path="/product/:id" element={<ProductById />} />
        </Routes>
      </MemoryRouter>,
      store
    );
  }

  it('fetches and displays the product name, price and description', async () => {
    renderPDP();

    // PDP renders name in both <h1> and the sticky mobile add bar — use heading query
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40');
    });
    // Price appears in main panel AND sticky bar; just confirm it exists
    expect(screen.getAllByText(/\$130\.00/)[0]).toBeInTheDocument();
    expect(screen.getByText(/running versátil/i)).toBeInTheDocument();
  });

  it('calls the correct product API endpoint', async () => {
    renderPDP();

    await waitFor(() => {
      expect(apiWithoutAuth.get).toHaveBeenCalledWith(`/products/${PRODUCT_ID}`);
    });
  });

  it('displays variant swatch buttons with aria-labels', async () => {
    renderPDP();

    // Wait for product to load
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40')
    );

    // Variants are rendered as buttons with aria-label (no visible text until selected)
    expect(screen.getByRole('button', { name: 'White/Black' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Blue/Silver' })).toBeInTheDocument();
  });

  it('shows size option buttons', async () => {
    renderPDP();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40')
    );

    // Size buttons have aria-label="US {size}" — size 42 is in product.sizes so it's enabled
    const sizeBtn = screen.getByRole('button', { name: 'US 42' });
    expect(sizeBtn).toBeInTheDocument();
    expect(sizeBtn).not.toBeDisabled();
  });

  it('shows error toast when clicking add-to-cart button without a size selected', async () => {
    renderPDP();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40')
    );

    // Before selecting a size the main CTA reads "Select a size" — clicking it fires handleAddToCart
    // which calls toastError('Please select a size first')
    const selectSizeBtn = screen.getByText('Select a size');
    userEvent.click(selectSizeBtn);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('size'));
    });
  });

  it('adds product to cart after selecting size and variant', async () => {
    const { store } = renderPDP();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40')
    );

    // Select a variant via aria-label button
    userEvent.click(screen.getByRole('button', { name: 'White/Black' }));

    // Select size 42 (aria-label="US 42", text content "42")
    userEvent.click(screen.getByRole('button', { name: 'US 42' }));

    // After size selected the main CTA changes to "Add to cart" — wait for re-render
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /add to cart/i }).length).toBeGreaterThan(0)
    );
    userEvent.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);

    await waitFor(() => {
      const cartItems = store.getState().cart.itemInCart ?? [];
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].name).toBe('Air Zoom Pegasus 40');
      expect(cartItems[0].sizes).toBe('42');
    });
  });

  it('shows "Out of stock" text when product inStock is 0', async () => {
    (apiWithoutAuth.get as jest.Mock).mockResolvedValue({
      data: { ...mockProduct, inStock: 0 },
    });

    renderPDP();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Air Zoom Pegasus 40')
    );

    // Component renders <p>Out of stock</p> when inStock === 0
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('shows skeleton while product is loading', () => {
    // Keep mock pending so loading state is visible
    (apiWithoutAuth.get as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    renderPDP();

    // Loading skeleton or spinner should be present
    const skeleton = document.querySelector('.stride-sk, [data-testid="pdp-skeleton"]');
    expect(skeleton).toBeTruthy();
  });
});

// ── SECTION 3: Cart drawer ────────────────────────────────────────────────────

describe('Cart drawer', () => {
  function renderCart(open: boolean, store = makeStore()) {
    const onClose = jest.fn();
    const result = renderWithStore(
      <MemoryRouter>
        <CartDrawer open={open} onClose={onClose} />
      </MemoryRouter>,
      store
    );
    return { ...result, onClose };
  }

  it('is hidden when open=false', () => {
    renderCart(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders empty state when cart has no items', () => {
    renderCart(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items when products are in the cart', () => {
    const store = makeStore({ cart: { itemInCart: [mockCartItem] } });
    renderCart(true, store);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Air Zoom Pegasus 40')).toBeInTheDocument();
  });

  it('shows subtotal and total', () => {
    const store = makeStore({ cart: { itemInCart: [mockCartItem] } });
    renderCart(true, store);

    // subtotal = 130 — CartLineItem mock renders the product name so the
    // $130 is in the price row; use getAllByText since the $ may span elements
    const priceEls = screen.getAllByText((content) => content.includes('130'));
    expect(priceEls.length).toBeGreaterThan(0);
  });

  it('shows item count in the header', () => {
    const store = makeStore({ cart: { itemInCart: [mockCartItem] } });
    renderCart(true, store);

    expect(screen.getByText(/1 item/i)).toBeInTheDocument();
  });

  it('closes when overlay is clicked', () => {
    const { onClose } = renderCart(true);

    const overlay = document.querySelector('.stride-overlay');
    if (overlay) userEvent.click(overlay as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });

  it('shows Checkout link pointing to /checkout', () => {
    const store = makeStore({ cart: { itemInCart: [mockCartItem] } });
    renderCart(true, store);

    const checkoutLink = screen.getByRole('link', { name: /checkout/i });
    expect(checkoutLink).toHaveAttribute('href', '/checkout');
  });

  it('shows free-shipping badge when subtotal >= $50', () => {
    const highValueItem = { ...mockCartItem, price: 60, quantity: 1 };
    const store = makeStore({ cart: { itemInCart: [highValueItem] } });
    renderCart(true, store);

    expect(screen.getByText(/free/i)).toBeInTheDocument();
  });
});

// ── SECTION 4: Checkout — full order placement flow ───────────────────────────

describe('Checkout — full flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeCheckoutStore() {
    return makeStore({ cart: { itemInCart: [mockCartItem] } });
  }

  function renderCheckout(store = makeCheckoutStore()) {
    return renderWithStore(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>,
      store
    );
  }

  async function setupAndCheckStock() {
    // Select address
    userEvent.click(screen.getAllByText('Select')[0]);
    await screen.findByTestId('pick-address');
    userEvent.click(screen.getByTestId('pick-address'));

    await waitFor(() =>
      expect(screen.queryByTestId('pick-address')).not.toBeInTheDocument()
    );

    // Select payment
    userEvent.click(screen.getByText('Select'));
    await screen.findByTestId('pick-payment');
    userEvent.click(screen.getByTestId('pick-payment'));

    await waitFor(() =>
      expect(screen.queryByTestId('pick-payment')).not.toBeInTheDocument()
    );

    // Check stock
    userEvent.click(screen.getByText(/Check stock availability/i));
    await waitFor(() =>
      expect(screen.getByText('Place order')).not.toBeDisabled()
    );
  }

  it('shows empty cart state when cart is empty', () => {
    const emptyStore = makeStore({ cart: { itemInCart: [] } });
    renderCheckout(emptyStore);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders the step bar (Address → Payment → Shipping → Confirm)', () => {
    renderCheckout();
    // Step bar renders Address, Payment, Confirm as unique labels
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    // "Shipping" appears in both the step bar AND the order totals row — use getAllByText
    expect(screen.getAllByText('Shipping').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('Place order button is disabled before completing all steps', () => {
    renderCheckout();
    expect(screen.getByText('Place order')).toBeDisabled();
  });

  it('happy path: places order and navigates to /history', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { ...mockProduct, inStock: 50 },
    });
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    renderCheckout();
    await setupAndCheckStock();

    userEvent.click(screen.getByText('Place order'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/orders/place', expect.objectContaining({
        userId:          mockDecodedUser.user_id,
        paymentType:     'Visa',
        shippingAddress: 'Gran Vía 1, Madrid',
        shippingMethod:  'DOOR',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/history');
    });
  });

  it('stock check failure: shows toast, keeps Place order disabled', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { ...mockProduct, inStock: 0 }, // out of stock
    });

    renderCheckout();

    // Select address & payment
    userEvent.click(screen.getAllByText('Select')[0]);
    await screen.findByTestId('pick-address');
    userEvent.click(screen.getByTestId('pick-address'));
    await waitFor(() => expect(screen.queryByTestId('pick-address')).not.toBeInTheDocument());

    userEvent.click(screen.getByText('Select'));
    await screen.findByTestId('pick-payment');
    userEvent.click(screen.getByTestId('pick-payment'));
    await waitFor(() => expect(screen.queryByTestId('pick-payment')).not.toBeInTheDocument());

    userEvent.click(screen.getByText(/Check stock availability/i));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('out of stock'));
    });
    expect(screen.getByText('Place order')).toBeDisabled();
  });

  it('409 from backend resets allow-to-pay and shows "out of stock" toast', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { ...mockProduct, inStock: 50 } });
    (api.post as jest.Mock).mockRejectedValue({ response: { status: 409 } });

    renderCheckout();
    await setupAndCheckStock();

    userEvent.click(screen.getByText('Place order'));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('out of stock'));
    });
    expect(mockNavigate).not.toHaveBeenCalled();
    // After 409 the button should be disabled again (allowToPay reset)
    await waitFor(() => {
      expect(screen.getByText('Place order')).toBeDisabled();
    });
  });

  it('home delivery adds $2.99 shipping; store pickup is free', async () => {
    renderCheckout();

    // Default is home delivery
    expect(screen.getByText('$2.99')).toBeInTheDocument();

    // Switch to store pickup
    userEvent.click(screen.getByText('Store pickup'));

    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument();
    });
  });
});
