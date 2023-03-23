import React from 'react'
import { Route, Routes } from 'react-router'
import ProductById from '../components/Product/ProductById'
import Home from './Home'
import Login from './Login'

const Navigation = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>404</h1>} />
      <Route path="/product/:id" element={<ProductById />} />
    </Routes>
  )
}

export default Navigation
