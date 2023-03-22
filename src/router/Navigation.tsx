import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './Home'
import Login from './Login'

const Navigation = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default Navigation
