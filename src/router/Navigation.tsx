import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router'
import ProductById from '../components/Product/ProductById'
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
  return (
    <>
      {!user ? (
        <Routes>
          {loginRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      ) : (
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductById />} />
        </Routes>
      )}
    </>
  )
}

export default Navigation
