import React from 'react'
import { Route, Routes } from 'react-router'

import ProductById from '../components/Product/ProductById'
import Home from './Home'
import Login from './Login'
import Profile from '../pages/User/Profile'
import Checkout from '../pages/Checkout/Checkout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import CreateAndCheck from '../pages/Admin/CreateAndCheck'
import AdminProducts from '../pages/Admin/AdminProducts'
import Customers from '../components/Admin/Customers/Customers'
import AdminOrders from '../pages/Admin/AdminOrders'

const Navigation = () => {
 // TODO: Check this user that comes from redux store
  // const { user } = useSelector((state: RootState) => state.userLogged)
  const userToken = localStorage.getItem('token')
  const { role } = JSON.parse(localStorage.getItem('user') || '{}')
  const decodedUserRole = JSON.parse(localStorage.getItem('decodedUser') || '{}').role

  const loginRoutes = [
    { path: '', element: <Login /> },
    { path: '/login', element: <Login /> },
  ]

  const homeRoutes = [

    { path: '/login', element: <Login /> },
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/product/:id', element: <ProductById /> },
    { path: '/profile', element: <Profile /> },
    { path: '/checkout', element: <Checkout /> },
    { path: '/checkout/product/:id', element: <ProductById /> },
  ]

  const adminRoutes = [
    { path: '/admin', element: <AdminDashboard /> },
    { path: '/admin/createandcheck', element: <CreateAndCheck /> },
    { path: '/admin/createandcheck/check', element: <CreateAndCheck /> },
    { path: '/admin/products', element: <AdminProducts /> },
    { path: '/admin/customers', element: <Customers /> },
    { path: '/admin/orders', element: <AdminOrders />},
  ]

  if (!userToken) {
    return (
      <Routes>
        {loginRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    )
  } else if (userToken &&  (role === 'ADMIN' || decodedUserRole === 'ADMIN')) {
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
