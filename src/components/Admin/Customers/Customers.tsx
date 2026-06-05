import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { AdminUser } from '../../../interfaces/admin/AdminTypes';
import { toastError } from '../../../utils/toasts';

const Customers: React.FC = () => {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    api.get<AdminUser[]>('/users')
      .then(r => setUsers(r.data))
      .catch(() => toastError('Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    search === '' ||
    `${u.firstname} ${u.lastname} ${u.username} ${u.email}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <span className="stride-eyebrow">Admin</span>
          <h2>Customers</h2>
        </div>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="stride-field" style={{ marginBottom: 'var(--space-5)', maxWidth: 320 }}>
        <input
          className="stride-input"
          placeholder="Search customers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="stride-sk" style={{ height: 44, borderRadius: 'var(--radius-sm)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="stride-empty">
          <i className="fa fa-users" />
          <h3>No customers found</h3>
        </div>
      ) : (
        <div className="stride-card">
          <table className="stride-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-fg-primary)' }}>
                    {u.firstname} {u.lastname}
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`stride-badge ${u.role === 'ADMIN' ? '' : 'stride-badge--soft'}`}>
                      {u.role}
                    </span>
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

export default Customers;
