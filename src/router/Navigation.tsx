import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'
import ProductById from '../components/Product/ProductById'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import Profile from '../pages/User/Profile'
import { RootState } from '../redux/store'
import Home from './Home'
import Login from './Login'

const Navigation = () => {
  const { user } = useSelector((state: RootState) => state.userLogged)
  console.log('🚀 ~ file: Navigation.tsx:11 ~ Navigation ~ user:', user)
  const loginRoutes = [
    { path: '', element: <Login /> },
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/*', element: <Login /> }
  ]

  const homeRoutes = [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/product/:id', element: <ProductById /> },
    { path: '/profile', element: <Profile /> }
  ]

  const adminRoutes = [
    { path: '/admin/dashboard', element: <AdminDashboard /> },
    { path: '/home', element: <Home /> },
    { path: '/product/:id', element: <ProductById /> },
    { path: '/profile', element: <Profile /> }
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
