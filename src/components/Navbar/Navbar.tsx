import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/actions/UserAction';
import { clearCart } from '../../redux/actions/CartActions';
import { clearWishList } from '../../redux/actions/WishesActions';
import { GlobalTheme } from '../../context/ThemeProvider';
import { isAdmin, isUserAuthenticated } from '../../utils/authentication';
import { notifyWarning } from '../../utils/notify';
import { ToastContainer } from 'react-toastify';
import Login from '../../router/Login';

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [loginOpen, setLoginOpen]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, userFromToken }     = useSelector((state: RootState) => state.userLogged);
  const cartItems                   = useSelector((state: RootState) => state.cart.itemInCart);
  const wishItems                   = useSelector((state: RootState) => state.wishes.itemInWishlist);

  const dispatch   = useDispatch<AppDispatch>();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { theme, setTheme } = GlobalTheme();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishList(''));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('decodedUser');
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  const cartCount = cartItems?.length ?? 0;
  const wishCount = wishItems?.length ?? 0;
  const authed    = isUserAuthenticated();
  const admin     = isAdmin();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Avatar initials fallback
  const initials = user?.given_name?.[0] ?? userFromToken?.username?.[0]?.toUpperCase() ?? '?';

  return (
    <>
      <nav className={`stride-navbar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="stride-navbar__inner">

          {/* Hamburger (mobile) */}
          <button
            className="stride-navbar__iconbtn stride-navbar__burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className="fa fa-bars" />
          </button>

          {/* Brand */}
          <Link to="/home" className="stride-navbar__brand">STRIDE</Link>

          {/* Nav links (desktop) */}
          <div className="stride-navbar__links">
            <Link to="/home"    className={isActive('/home') || location.pathname === '/' ? 'is-active' : ''}>Store</Link>
            {admin && <Link to="/admin"   className={isActive('/admin') ? 'is-active' : ''}>Admin</Link>}
          </div>

          {/* Actions */}
          <div className="stride-navbar__actions">

            {/* Dark mode toggle */}
            <button
              className="stride-navbar__iconbtn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              <i className={`fa ${theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`} />
            </button>

            {/* Wishlist */}
            {authed && (
              <button
                className="stride-navbar__iconbtn"
                title="Wishlist"
                onClick={() => notifyWarning('Wishlist coming soon')}
              >
                <i className="fa fa-heart-o" />
                {wishCount > 0 && <span className="stride-navbar__badge">{wishCount}</span>}
              </button>
            )}

            {/* Cart */}
            <Link to="/checkout" className="stride-navbar__iconbtn" title="Cart">
              <i className="fa fa-shopping-bag" />
              {cartCount > 0 && <span className="stride-navbar__badge">{cartCount}</span>}
            </Link>

            {/* Profile / Login */}
            {authed ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                  className="stride-navbar__iconbtn"
                  onClick={() => setMenuOpen((o) => !o)}
                  style={{ padding: 0, width: 42, height: 42 }}
                  aria-label="Account menu"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className={`stride-navbar__avatar${admin ? ' is-admin' : ''}`}
                    />
                  ) : (
                    <span className={`stride-navbar__avatar${admin ? ' is-admin' : ''}`}>
                      {initials}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <div className="stride-navbar__menu">
                    <div className="stride-navbar__menu-head">
                      {user?.picture ? (
                        <img src={user.picture} alt="" className="stride-navbar__avatar" />
                      ) : (
                        <span className="stride-navbar__avatar">{initials}</span>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {user?.given_name ?? userFromToken?.username}
                        </div>
                        {admin && (
                          <span className="stride-badge stride-badge--soft" style={{ fontSize: 11, marginTop: 2 }}>
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                    <hr className="stride-divider" style={{ margin: '4px 0' }} />
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                      <i className="fa fa-user" />Profile
                    </Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)}>
                      <i className="fa fa-history" />Order History
                    </Link>
                    {admin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>
                        <i className="fa fa-cogs" />Admin Panel
                      </Link>
                    )}
                    <hr className="stride-divider" style={{ margin: '4px 0' }} />
                    <button onClick={handleLogout}>
                      <i className="fa fa-sign-out" />Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="stride-btn stride-btn--outline stride-btn--sm"
                onClick={() => setLoginOpen((o) => !o)}
              >
                {loginOpen ? 'Close' : 'Login'}
              </button>
            )}
          </div>
        </div>

        {/* Login overlay */}
        {loginOpen && !authed && (
          <div
            style={{
              position: 'absolute',
              top: '66px',
              left: 0,
              right: 0,
              zIndex: 80,
              background: 'var(--color-bg-surface)',
              borderBottom: '1px solid var(--color-border-default)',
              boxShadow: 'var(--shadow-medium)',
            }}
          >
            <Login />
          </div>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <>
          <div
            className="stride-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="stride-navbar__brand">STRIDE</span>
              <button
                className="stride-navbar__iconbtn"
                onClick={() => setMobileOpen(false)}
              >
                <i className="fa fa-close" />
              </button>
            </div>
            <Link to="/home"    onClick={() => setMobileOpen(false)}>Store</Link>
            {authed && <Link to="/profile"  onClick={() => setMobileOpen(false)}>Profile</Link>}
            {authed && <Link to="/history"  onClick={() => setMobileOpen(false)}>Orders</Link>}
            {admin   && <Link to="/admin"    onClick={() => setMobileOpen(false)}>Admin</Link>}
            {!authed && (
              <button
                className="stride-btn stride-btn--primary stride-btn--block s-mt-6"
                onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
              >
                Login
              </button>
            )}
            {authed && (
              <button
                className="stride-btn stride-btn--outline stride-btn--block s-mt-6"
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out" style={{ marginRight: 8 }} />Sign out
              </button>
            )}
          </div>
        </>
      )}

      {/* Toast container */}
      <div className="stride-navbar__notification">
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

export default Navbar;
