import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory'
import LightModeIcon from '@mui/icons-material/LightMode'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { NavbarIcon } from '../Cart/Cart'
import { AppDispatch, RootState } from '../../redux/store'
import { logout } from '../../redux/actions/UserAction'
import './styles/Navbar.scss'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const { user } = useSelector((state: RootState) => state.userLogged)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch(logout())
  }
  const handleDarkMode = () => {
    setIsDark(!isDark)
  }
  return (
    <div className="flex justify-between items-center bg-gray-100 p-4">
      <div className="text-2xl font-bold text-gray-800 flex items-center">
        {user ? (
          <>
            <img
              src={user?.picture}
              alt={user?.name}
              style={{
                width: '50px',
                height: '50px',
                marginRight: '10px',
                borderRadius: '40%'
              }}
            />
            <h1>{user?.name}</h1>
          </>
        ) : (
          <StoreMallDirectoryIcon
            style={{
              width: '50px',
              height: '50px'
            }}
            color="primary"
          />
        )}
      </div>
      <div className="navbar">
        {user && user.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="navbar__links">
            Admin
          </Link>
        )}
        {user ? (
          <>
            <Link to="/home" className="navbar__links">
              Store
            </Link>
            <Link to="/profile" className="navbar__links">
              Profile
            </Link>
            <div className="navbar__links--login" onClick={handleLogout}>
              Logout
            </div>
            <div className="navbar__links__cart">
              <NavbarIcon />
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__links">
              Login to Store
            </Link>
            <div className="navbar__links">
              {isDark ? (
                <Brightness4Icon
                  onClick={handleDarkMode}
                  style={{
                    width: '35px',
                    height: '35px'
                  }}
                />
              ) : (
                <LightModeIcon
                  onClick={handleDarkMode}
                  color="warning"
                  style={{
                    width: '35px',
                    height: '35px'
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="navbar_mobile">
        {isOpen ? (
          <CloseIcon className="text-gray-800" onClick={() => setIsOpen(!isOpen)} />
        ) : (
          <MenuIcon className="text-gray-800" onClick={() => setIsOpen(!isOpen)} />
        )}
        {isOpen && (
          <div className="navbar_mobile__view">
            <div className="navbar_mobile__view__user">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                <div className="navbar_mobile__view__user--avatar">
                  <img src={user.picture} alt="user" className="w-20 h-20" />
                </div>
                <p className="navbar_mobile__view__user--name">
                  <span className="text-gray-800">{user.given_name}</span>
                </p>
              </div>
              <div className="email">
                <p className="navbar_mobile__view__user--email">{user?.email}</p>
              </div>
              <div className="navbar_mobile__view__user--cart">{/* <NavbarIcon /> */}</div>
            </div>
            <div className="navbar_mobile__view__links">
              <Link to="/home" className="navbar_mobile__view__links--item">
                Home
              </Link>
              <Link to="/login" className="navbar_mobile__view__links--item">
                Products
              </Link>
              <Link to="/" className="navbar_mobile__view__links--item--login">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
