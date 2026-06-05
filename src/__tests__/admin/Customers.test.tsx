import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Customers from '../../components/Admin/Customers/Customers';
import { api } from '../../utils/api';
import { renderWithRouter } from '../../test-helpers/adminTestUtils';

jest.mock('../../utils/api', () => ({
  api: { get: jest.fn(), put: jest.fn() },
}));

jest.mock('../../utils/toasts', () => ({
  toastError:   jest.fn(),
  toastSuccess: jest.fn(),
  toastDelete:  jest.fn(),
}));

const mockApiGet = api.get as jest.Mock;

const MOCK_USERS = [
  { id: 'u1', username: 'alice',   firstname: 'Alice',   lastname: 'Smith', email: 'alice@example.com',   phone: '555-1111', role: 'USER'  },
  { id: 'u2', username: 'bob',     firstname: 'Bob',     lastname: 'Jones', email: 'bob@example.com',     phone: '555-2222', role: 'USER'  },
  { id: 'u3', username: 'charlie', firstname: 'Charlie', lastname: 'King',  email: 'charlie@example.com', phone: '555-3333', role: 'ADMIN' },
];

describe('Customers (admin)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiGet.mockResolvedValue({ data: MOCK_USERS });
  });

  it('renders the Customers heading', async () => {
    renderWithRouter(<Customers />);
    await waitFor(() => expect(screen.getByText('Customers')).toBeInTheDocument());
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows all fetched users in the table', async () => {
    renderWithRouter(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Charlie King')).toBeInTheDocument();
  });

  it('displays correct user count', async () => {
    renderWithRouter(<Customers />);
    await waitFor(() => expect(screen.getByText('3 users')).toBeInTheDocument());
  });

  it('filters users by search term', async () => {
    renderWithRouter(<Customers />);
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
    renderWithRouter(<Customers />);
    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());

    const input = screen.getByPlaceholderText('Search customers…');
    await userEvent.type(input, 'zzznomatch');

    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument();
    });
  });

  it('shows loading skeletons before data arrives', () => {
    mockApiGet.mockReturnValue(new Promise(() => {}));
    renderWithRouter(<Customers />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows the ADMIN badge for admin users', async () => {
    renderWithRouter(<Customers />);
    await waitFor(() => expect(screen.getByText('Charlie King')).toBeInTheDocument());
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });
});
