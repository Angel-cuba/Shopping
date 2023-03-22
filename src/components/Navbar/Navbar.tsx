import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import './styles/Navbar.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div>
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <div className="text-2xl font-bold text-gray-800">
          <h1>Welcome user</h1>
        </div>
        <div className="navbar">
          <Link to="/home" className="navbar__links">
            Home
          </Link>
          <Link to="/login" className="navbar__links">
            Login
          </Link>
          <div className="navbar__links--login">Login</div>
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
                    <img src="https://picsum.photos/200" alt="user" className="w-20 h-20" />
                  </div>
                  <p className="navbar_mobile__view__user--name">
                    <span className="text-gray-800">Angel Luis</span>
                  </p>
                </div>
                <div className="email">
                  <p className="navbar_mobile__view__user--email">angel@gmail.com</p>
                </div>
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
    </div>
  )
}

export default Navbar
