import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { NavbarIcon, WishListIcon } from '../Cart/Cart';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/actions/UserAction';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import './Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.userLogged);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = GlobalTheme();

  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigation('/');
    dispatch(logout());
  };
  const handleDarkMode = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    setIsDark(!isDark);
  };
  return (
    <div
      className="navbar"
      style={{
        backgroundColor: theme === 'light' ? lightTheme.bg : darkTheme.bg,
        boxShadow: `0 0 12 0 ${theme === 'light' ? lightTheme.shadow : darkTheme.shadow}, inset 0 0 12px 0 ${theme === 'light' ? lightTheme.shadow : darkTheme.shadow}`,
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      <div className="navbar__navbar-left">
        {user ? (
          <>
            <img
              src={user?.picture}
              alt={user?.name}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
                borderRadius: '40%',
              }}
            />
            <h1>{user?.name}</h1>
          </>
        ) : (
          <StoreMallDirectoryIcon
            style={{
              width: '50px',
              height: '50px',
            }}
            color="primary"
          />
        )}
      </div>
      <div className="navbar__navbar-right">
        {user && user.role === 'ADMIN' && (
          <Link
            to="/admin/dashboard"
            className="navbar__navbar-right__links"
            style={{
              color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
            }}
          >
            Admin
          </Link>
        )}
        {user ? (
          <>
            <Link
              to="/home"
              className="navbar__navbar-right__links"
              style={{
                color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
              }}
            >
              Store
            </Link>
            <Link
              to="/profile"
              className="navbar__navbar-right__links"
              style={{
                color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
              }}
            >
              Profile
            </Link>
               {isDark ? (
              <Brightness4Icon
                onClick={handleDarkMode}
                style={{
                  width: '35px',
                  height: '35px',
                  color: lightTheme.textLink,
                  cursor: 'pointer',
                }}
              />
            ) : (
              <LightModeIcon
                onClick={handleDarkMode}
                color="warning"
                style={{
                  width: '35px',
                  height: '35px',
                  cursor: 'pointer',
                }}
              />
            )}
            <div className="navbar__navbar-right__links--login" onClick={handleLogout}
                style={{
              color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
            }}
            
            >
              Logout
            </div>
            <div className="navbar__navbar-right__links__cart">
              <WishListIcon />
              <NavbarIcon />
            </div>
          </>
        ) : null}
      </div>
      <div className="navbar__navbar_mobile">
        {isOpen ? (
          <CloseIcon
            style={{
              color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <MenuIcon
            style={{
              color: '#000',
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        {isOpen && (
          <div className="navbar__navbar_mobile__view">
            <div className="navbar__navbar_mobile__view__user">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div className="navbar__navbar_mobile__view__user--avatar">
                  <img src={user.picture} alt="user" className="w-20 h-20" />
                </div>
                <p className="navbar__navbar_mobile__view__user--name">
                  <span className="navbar__navbar_mobile__view__user--name--text">
                    {user.given_name}
                  </span>
                </p>
              </div>
              <div className="email">
                <p className="navbar__navbar_mobile__view__user--email">{user?.email}</p>
              </div>
              <div className="navbar__navbar_mobile__view__user--cart">{/* <NavbarIcon /> */}</div>
            </div>
            <div className="navbar__navbar_mobile__view__links">
              <Link to="/home" className="navbar__navbar_mobile__view__links--item">
                Home
              </Link>
              <Link to="/login" className="navbar__navbar_mobile__view__links--item">
                Products
              </Link>
              <Link to="/" className="navbar__navbar_mobile__view__links--item--login">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
