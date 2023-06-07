import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Group from '@mui/icons-material/Group';

import { NavbarIcon, WishListIcon } from '../Cart/Icons';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/actions/UserAction';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import { notifyRedirect, notifyWarning } from '../../utils/notify';
import { ToastContainer } from 'react-toastify';
import { isAdmin, isUserAuthenticated } from '../../utils/authentication';
import Login from '../../router/Login';
import './Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const { user, userFromToken } = useSelector((state: RootState) => state.userLogged);

  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = GlobalTheme();
  const [openLogin, setOpenLogin] = useState(false);

  const navigation = useNavigate();

  const handleLogout = () => {
    notifyRedirect();
    setTimeout(() => {
      goingToLogin();
    }, 2800);
  };

  const handleLogin = () => {
    setOpenLogin(!openLogin);
  };

  const profileWarning = () => {
    return notifyWarning('Please, login first to see you profile');
  };

  const goingToLogin = () => {
    navigation('/', { replace: true });
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('decodedUser');
    window.location.reload();
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
        boxShadow: `0 0 12 0 ${
          theme === 'light' ? lightTheme.shadow : darkTheme.shadow
        }, inset 0 0 12px 0 ${theme === 'light' ? lightTheme.shadow : darkTheme.shadow}`,
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      <div className="navbar__navbar-left">
        {isUserAuthenticated() ? (
          <>
            <img
              src={
                user?.picture
                  ? user?.picture
                  : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
              }
              alt={user?.name}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
                borderRadius: '40%',
              }}
            />
            <h1>{user?.name ? user.name : userFromToken?.username}</h1>
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
        {isAdmin() && (
          <Link
            to="/admin"
            className="navbar__navbar-right__links"
            style={{
              color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
            }}
          >
            Admin
          </Link>
        )}
        <Link
          to="/home"
          className="navbar__navbar-right__links"
          style={{
            color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
          }}
        >
          Store
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
        {isUserAuthenticated() ? (
          <>
            <Link
              to="/profile"
              className="navbar__navbar-right__links"
              style={{
                color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
              }}
            >
              Profile
            </Link>
            <div
              className="navbar__navbar-right__links--login"
              onClick={handleLogout}
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
        ) : (
          <>
            <div
              className="navbar__navbar-right__links"
              style={{
                color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
              }}
              onClick={profileWarning}
            >
              <Group
                style={{
                  fontSize: '2rem',
                }}
              />
            </div>
            <div
              className="navbar__navbar-right__links--login"
              onClick={handleLogin}
              style={{
                color: theme === 'light' ? darkTheme.textLink : lightTheme.textLink,
              }}
            >
              Login
            </div>
            <div className="navbar__navbar-right__links__cart">
              <NavbarIcon />
            </div>
          </>
        )}
      </div>
      {openLogin && (
        <div className="navbar__open-login-register">
          <Login />
        </div>
      )}
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
      <div className="navbar__notification">
        <ToastContainer />
      </div>
    </div>
  );
};

export default Navbar;
