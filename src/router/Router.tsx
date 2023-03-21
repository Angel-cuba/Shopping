import React from 'react'
import Home from './Home'
import Login from './Login'

const Router = () => {
  const user = false
  return <>{user ? <Home /> : <Login />}</>
}

export default Router
