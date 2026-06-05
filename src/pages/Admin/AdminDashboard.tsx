import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchProducts } from '../../redux/actions/ProductActions';
import { api } from '../../utils/api';
import { AdminOrder, AdminUser } from '../../interfaces/admin/AdminTypes';

const AdminDashboard: React.FC = () => {
  const dispatch  = useDispatch<AppDispatch>();
  const products  = useSelector((s: RootState) => s.products.products);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users,  setUsers]  = useState<AdminUser[]>([]);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  useEffect(() => {
    api.get<AdminOrder[]>('/orders').then(r => setOrders(r.data)).catch(() => {});
    api.get<AdminUser[]>('/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const revenue      = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  const stats = [
    { icon: 'fa-users',    label: 'Customers',    value: users.length,                    color: 'var(--color-action)' },
    { icon: 'fa-tag',      label: 'Products',     value: products.length,                 color: '#22c55e' },
    { icon: 'fa-list-alt', label: 'Total orders', value: orders.length,                   color: '#f59e0b' },
    { icon: 'fa-dollar',   label: 'Revenue',      value: `$${revenue.toLocaleString()}`,  color: '#8b5cf6' },
  ];

  const quickLinks = [
    { to: '/admin/products',  icon: 'fa-plus',     label: 'Add product',     desc: 'Create or edit a product listing' },
    { to: '/admin/orders',    icon: 'fa-list-alt', label: `${pendingCount} pending`, desc: 'Orders waiting for confirmation' },
    { to: '/admin/customers', icon: 'fa-users',    label: 'View customers',  desc: 'Browse and manage user accounts' },
  ];

  return (
    <>
      <div className="stride-section-head" style={{ marginBottom: 'var(--space-8)' }}>
        <div>
          <span className="stride-eyebrow">Admin</span>
          <h2>Dashboard</h2>
        </div>
      </div>

      <div className="stride-stat-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {stats.map(({ icon, label, value, color }) => (
          <div key={label} className="stride-card stride-stat-card">
            <div className="ico" style={{ background: `${color}18`, color }}>
              <i className={`fa ${icon}`} />
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
        Quick actions
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-4)' }}>
        {quickLinks.map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="stride-card stride-card__pad" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--color-action-subtle)', color: 'var(--color-action)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <i className={`fa ${icon}`} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;
