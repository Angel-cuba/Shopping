import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/actions/UserAction';
import { clearCart } from '../../redux/actions/CartActions';
import { clearWishList } from '../../redux/actions/WishesActions';
import { GlobalTheme } from '../../context/ThemeProvider';
import { isAdmin, isUserAuthenticated } from '../../utils/authentication';
import Login from '../../router/Login';
import CartDrawer from '../Cart/CartDrawer';

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [loginOpen, setLoginOpen]   = useState(false);
  const [cartOpen,  setCartOpen]    = useState(false);
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

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishList());
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
            <Link to="/home" className={isActive('/home') || location.pathname === '/' ? 'is-active' : ''}>Store</Link>
            {admin && <Link to="/admin" className={isActive('/admin') ? 'is-active' : ''}>Admin</Link>}

            <Link to="/faq"        className={isActive('/faq')        ? 'is-active' : ''}>FAQ</Link>
            <Link to="/shipping"   className={isActive('/shipping')   ? 'is-active' : ''}>Shipping</Link>
            <Link to="/size-guide" className={isActive('/size-guide') ? 'is-active' : ''}>Size Guide</Link>
            <Link to="/contact"    className={isActive('/contact')    ? 'is-active' : ''}>Contact</Link>
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
                onClick={() => navigate('/wishlist')}
              >
                <i className="fa fa-heart-o" />
                {wishCount > 0 && <span className="stride-navbar__badge">{wishCount}</span>}
              </button>
            )}

            {/* Cart */}
            <button
              className="stride-navbar__iconbtn"
              title="Cart"
              aria-label={`Cart, ${cartCount} items`}
              onClick={() => setCartOpen(true)}
              style={{ position: 'relative' }}
            >
              <i className="fa fa-shopping-bag" />
              {cartCount > 0 && <span className="stride-navbar__badge">{cartCount}</span>}
            </button>

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

      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <>
          <div
            className="stride-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-menu">
            {/* Header */}
            <div className="mobile-menu__header">
              <span className="stride-navbar__brand">STRIDE</span>
              <button className="stride-navbar__iconbtn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <i className="fa fa-times" />
              </button>
            </div>

            {/* Nav section */}
            <nav className="mobile-menu__section">
              <span className="mobile-menu__label">Navigate</span>
              <Link to="/home" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-home" /><span>Store</span>
              </Link>
              {authed && (
                <Link to="/profile" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  <i className="fa fa-user-o" /><span>Profile</span>
                </Link>
              )}
              {authed && (
                <Link to="/history" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  <i className="fa fa-history" /><span>Orders</span>
                </Link>
              )}
              {authed && (
                <Link to="/wishlist" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  <i className="fa fa-heart-o" /><span>Wishlist</span>
                </Link>
              )}
              {admin && (
                <Link to="/admin" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  <i className="fa fa-cogs" /><span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Help section */}
            <nav className="mobile-menu__section">
              <span className="mobile-menu__label">Help</span>
              <Link to="/faq"        className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-question-circle-o" /><span>FAQ</span>
              </Link>
              <Link to="/shipping"   className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-truck" /><span>Shipping</span>
              </Link>
              <Link to="/size-guide" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-arrows-h" /><span>Size Guide</span>
              </Link>
              <Link to="/contact"    className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-envelope-o" /><span>Contact</span>
              </Link>
            </nav>

            {/* Footer */}
            <div className="mobile-menu__footer">
              {!authed ? (
                <button
                  className="stride-btn stride-btn--primary stride-btn--block"
                  onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                >
                  Sign in
                </button>
              ) : (
                <button className="mobile-menu__signout" onClick={handleLogout}>
                  <i className="fa fa-sign-out" />Sign out
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Login modal */}
      {loginOpen && !authed && (
        <>
          <div className="stride-overlay" onClick={() => setLoginOpen(false)} />
          <div className="stride-modal-wrap">
            <div className="stride-modal" style={{ width: 480 }}>
              <div className="stride-modal__head">
                <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  STRIDE
                </span>
                <button
                  className="stride-navbar__iconbtn"
                  style={{ width: 36, height: 36 }}
                  onClick={() => setLoginOpen(false)}
                  aria-label="Close"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
              <div className="stride-modal__body">
                <Login onSuccess={() => setLoginOpen(false)} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
