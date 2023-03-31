import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'

import ProductById from '../components/Product/ProductById'
import { RootState } from '../redux/store'
import Home from './Home'
import Login from './Login'
import Profile from '../pages/User/Profile'
import Checkout from '../pages/Checkout/Checkout'
import AdminDashboard from '../pages/Admin/AdminDashboar'
import CreateAndCheck from '../pages/Admin/CreateAndCheck'

const Navigation = () => {
  const { user } = useSelector((state: RootState) => state.userLogged)

  const loginRoutes = [
    { path: '', element: <Login /> },
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/*', element: <Login /> }
  ]

  const homeRoutes = [
    { path: '', element: <Home /> },
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/product/:id', element: <ProductById /> },
    { path: '/profile', element: <Profile /> },
    { path: '/checkout', element: <Checkout /> },
    { path: '/checkout/product/:id', element: <ProductById /> },
    { path: '/*', element: <Home /> }
  ]

  const adminRoutes = [
    { path: '/admin/dashboard', element: <AdminDashboard /> },
    { path: '/admin/createandcheck', element: <CreateAndCheck /> },
    { path: '/admin/createandcheck/check', element: <CreateAndCheck /> },
    { path: '/admin/*', element: <AdminDashboard /> }
  ]

  if (!user) {
    return (
      <Routes>
        {loginRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    )
  } else if (user?.role === 'ADMIN') {
    return (
      <Routes>
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {homeRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    )
  } else {
    return (
      <Routes>
        {homeRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    )
  }
}

export default Navigation
