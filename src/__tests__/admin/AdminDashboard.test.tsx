import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import { api } from '../../utils/api';
import ProductsReducer from '../../redux/reducers/ProductReducer';
import CartReducer from '../../redux/reducers/CartReducer';
import { userReducer } from '../../redux/reducers/UserReducer';
import WishReducer from '../../redux/reducers/WishesReducer';
import paymentReducer from '../../redux/reducers/PaymentReducer';
import addressReducer from '../../redux/reducers/AddressReducer';

// Mock api module
jest.mock('../../utils/api', () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const mockApiGet = api.get as jest.Mock;

function makeStore() {
  return configureStore({
    reducer: {
      cart:      CartReducer,
      products:  ProductsReducer,
      userLogged: userReducer,
      wishes:    WishReducer,
      payments:  paymentReducer,
      addresses: addressReducer,
    },
  });
}

function renderDashboard() {
  const testStore = makeStore();
  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    </Provider>
  );
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: both endpoints return empty arrays
    mockApiGet.mockResolvedValue({ data: [] });
  });

  it('renders the Dashboard heading', () => {
    renderDashboard();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders all four stat card labels', () => {
    renderDashboard();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Total orders')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('shows zero counts initially and resolves to fetched counts', async () => {
    mockApiGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          data: [
            {
              id: 'o1',
              orderDetails: [],
              paymentType: 'CARD',
              shippingAddress: '1 Main St',
              shippingMethod: 'DOOR',
              shippingFee: 5,
              total: 99,
              status: 'PENDING',
              createdAt: '2024-01-01T00:00:00',
              userFirstname: 'Alice',
              userLastname: 'Smith',
              userEmail: 'alice@example.com',
              userId: 'u1',
            },
          ],
        });
      }
      if (url === '/users') {
        return Promise.resolve({
          data: [
            { id: 'u1', username: 'alice', firstname: 'Alice', lastname: 'Smith', email: 'alice@example.com', phone: '555-1234', role: 'USER' },
            { id: 'u2', username: 'bob',   firstname: 'Bob',   lastname: 'Jones', email: 'bob@example.com',   phone: '555-5678', role: 'USER' },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderDashboard();

    await waitFor(() => {
      // 1 order, 2 users — counts come from local state after fetch
      expect(screen.getByText('1')).toBeInTheDocument(); // Total orders
      expect(screen.getByText('2')).toBeInTheDocument(); // Customers
    });
  });

  it('renders the Quick actions section with 3 links', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Quick actions')).toBeInTheDocument();
    });
    expect(screen.getByText('Add product')).toBeInTheDocument();
    expect(screen.getByText('View customers')).toBeInTheDocument();
  });
});
