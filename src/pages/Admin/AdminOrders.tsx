import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { AdminOrder } from '../../interfaces/admin/AdminTypes';
import { OrderStatus } from '../../interfaces/profile/order/orderType';
import { toastSuccess, toastError } from '../../utils/toasts';
import { OrderStatusBadge, formatOrderDate } from '../../components/shared/OrderStatusBadge';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders: React.FC = () => {
  const [orders,       setOrders]       = useState<AdminOrder[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [updating,     setUpdating]     = useState<string | null>(null);

  useEffect(() => {
    api.get<AdminOrder[]>('/orders')
      .then(r => setOrders(r.data))
      .catch(() => toastError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const r = await api.put<AdminOrder>(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? r.data : o));
      toastSuccess('Status updated');
    } catch {
      toastError('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch  = search === '' ||
      `${o.userFirstname} ${o.userLastname} ${o.userEmail}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter === '' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <span className="stride-eyebrow">Admin</span>
          <h2>Orders</h2>
        </div>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div className="stride-field" style={{ margin: 0, flex: '1 1 200px' }}>
          <input
            className="stride-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="stride-field" style={{ margin: 0 }}>
          <select
            className="stride-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | '')}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="stride-card stride-card__pad">
              <div className="stride-sk" style={{ height: 14, width: '40%' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="stride-empty">
          <i className="fa fa-list-alt" />
          <h3>No orders found</h3>
        </div>
      ) : (
        <div className="stride-card">
          <table className="stride-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Shipping</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-fg-primary)' }}>
                      {o.userFirstname} {o.userLastname}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                      {o.userEmail}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatOrderDate(o.createdAt)}</td>
                  <td>{o.paymentType}</td>
                  <td>{o.shippingMethod === 'DOOR' ? 'Home' : 'Store'}</td>
                  <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td>
                    <select
                      className="stride-input"
                      style={{ fontSize: 'var(--text-xs)', padding: '4px 8px', width: 'auto' }}
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={e => handleStatusUpdate(o.id, e.target.value as OrderStatus)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
