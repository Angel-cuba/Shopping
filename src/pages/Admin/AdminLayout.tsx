import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const NAV = [
  { to: '/admin',            exact: true,  icon: 'fa-tachometer', label: 'Dashboard' },
  { to: '/admin/customers',  exact: false, icon: 'fa-users',      label: 'Customers' },
  { to: '/admin/products',   exact: false, icon: 'fa-tag',        label: 'Products'  },
  { to: '/admin/orders',     exact: false, icon: 'fa-list-alt',   label: 'Orders'    },
];

const AdminLayout: React.FC = () => {
  const navigate       = useNavigate();
  const userFromToken  = useSelector((s: RootState) => s.userLogged.userFromToken);

  // Guard: redirect non-admin users as soon as the token is loaded
  React.useEffect(() => {
    if (userFromToken !== undefined && (!userFromToken || userFromToken.role !== 'ADMIN')) {
      navigate('/home');
    }
  }, [userFromToken, navigate]);

  return (
    <div className="stride-admin">
      <aside className="stride-admin-side">
        <div className="stride-admin-side__brand">
          <span className="logo"><i className="fa fa-bolt" /></span>
          <span>Admin</span>
        </div>

        {NAV.map(({ to, exact, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => isActive ? 'is-active' : ''}
          >
            <i className={`fa ${icon}`} style={{ width: 18, textAlign: 'center' }} />
            {label}
          </NavLink>
        ))}
      </aside>

      <main className="stride-admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
