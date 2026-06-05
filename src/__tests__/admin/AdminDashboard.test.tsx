import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import { api } from '../../utils/api';
import { renderWithStore } from '../../test-helpers/adminTestUtils';

jest.mock('../../utils/api', () => ({
  api: { get: jest.fn(), put: jest.fn() },
}));

// Suppress non-serialisable Redux middleware warning in tests
jest.mock('../../utils/toasts', () => ({
  toastError:   jest.fn(),
  toastSuccess: jest.fn(),
  toastDelete:  jest.fn(),
}));

const mockApiGet = api.get as jest.Mock;

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiGet.mockResolvedValue({ data: [] });
  });

  it('renders the Dashboard heading', async () => {
    renderWithStore(<AdminDashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders all four stat card labels', async () => {
    renderWithStore(<AdminDashboard />);
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Total orders')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('shows fetched order and user counts in their respective stat cards', async () => {
    mockApiGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          data: [{
            id: 'o1', orderDetails: [], paymentType: 'CARD',
            shippingAddress: '1 Main St', shippingMethod: 'DOOR',
            shippingFee: 5, total: 99, status: 'PENDING',
            createdAt: '2024-01-01T00:00:00',
            userFirstname: 'Alice', userLastname: 'Smith',
            userEmail: 'alice@example.com', userId: 'u1',
          }],
        });
      }
      if (url === '/users') {
        return Promise.resolve({
          data: [
            { id: 'u1', username: 'alice', firstname: 'Alice', lastname: 'Smith', email: 'alice@example.com', phone: '555-1111', role: 'USER' },
            { id: 'u2', username: 'bob',   firstname: 'Bob',   lastname: 'Jones', email: 'bob@example.com',  phone: '555-2222', role: 'USER' },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithStore(<AdminDashboard />);

    await waitFor(() => {
      // Scope each count assertion to its own card to avoid false positives
      const ordersCard    = screen.getByText('Total orders').closest('.stride-stat-card') as HTMLElement;
      const customersCard = screen.getByText('Customers').closest('.stride-stat-card') as HTMLElement;
      expect(within(ordersCard).getByText('1')).toBeInTheDocument();
      expect(within(customersCard).getByText('2')).toBeInTheDocument();
    });
  });

  it('renders Quick actions section with navigation links', async () => {
    renderWithStore(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Quick actions')).toBeInTheDocument();
    });
    expect(screen.getByText('Add product')).toBeInTheDocument();
    expect(screen.getByText('View customers')).toBeInTheDocument();
  });
});
