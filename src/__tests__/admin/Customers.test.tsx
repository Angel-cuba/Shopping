import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Customers from '../../components/Admin/Customers/Customers';
import { api } from '../../utils/api';
import ProductsReducer from '../../redux/reducers/ProductReducer';
import CartReducer from '../../redux/reducers/CartReducer';
import { userReducer } from '../../redux/reducers/UserReducer';
import WishReducer from '../../redux/reducers/WishesReducer';
import paymentReducer from '../../redux/reducers/PaymentReducer';
import addressReducer from '../../redux/reducers/AddressReducer';

jest.mock('../../utils/api', () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const mockApiGet = api.get as jest.Mock;

const MOCK_USERS = [
  { id: 'u1', username: 'alice',   firstname: 'Alice',   lastname: 'Smith', email: 'alice@example.com',   phone: '555-1111', role: 'USER'  },
  { id: 'u2', username: 'bob',     firstname: 'Bob',     lastname: 'Jones', email: 'bob@example.com',     phone: '555-2222', role: 'USER'  },
  { id: 'u3', username: 'charlie', firstname: 'Charlie', lastname: 'King',  email: 'charlie@example.com', phone: '555-3333', role: 'ADMIN' },
];

function makeStore() {
  return configureStore({
    reducer: {
      cart:       CartReducer,
      products:   ProductsReducer,
      userLogged: userReducer,
      wishes:     WishReducer,
      payments:   paymentReducer,
      addresses:  addressReducer,
    },
  });
}

function renderCustomers() {
  return render(
    <Provider store={makeStore()}>
      <BrowserRouter>
        <Customers />
      </BrowserRouter>
    </Provider>
  );
}

describe('Customers (admin)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiGet.mockResolvedValue({ data: MOCK_USERS });
  });

  it('renders the Customers heading', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('Customers')).toBeInTheDocument());
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows all fetched users in the table', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Charlie King')).toBeInTheDocument();
  });

  it('displays correct user count', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('3 users')).toBeInTheDocument());
  });

  it('filters users by search term', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());

    const input = screen.getByPlaceholderText('Search customers…');
    await userEvent.type(input, 'alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
      expect(screen.queryByText('Charlie King')).not.toBeInTheDocument();
    });
  });

  it('shows "No customers found" when search has no results', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());

    const input = screen.getByPlaceholderText('Search customers…');
    await userEvent.type(input, 'zzznomatch');

    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument();
    });
  });

  it('shows loading skeletons before data arrives', () => {
    // Never resolve — keep loading state
    mockApiGet.mockReturnValue(new Promise(() => {}));
    renderCustomers();
    // Table should not be present, skeletons should be
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows the ADMIN badge for admin users', async () => {
    renderCustomers();
    await waitFor(() => expect(screen.getByText('Charlie King')).toBeInTheDocument());
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });
});
