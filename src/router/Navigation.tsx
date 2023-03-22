import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './Home'
import Login from './Login'

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Login />} />
    </Routes>
  )
}

export default Navigation
