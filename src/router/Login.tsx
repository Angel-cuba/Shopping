import React from 'react'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const handleResponse = (response: unknown) => {
    console.log(response)
  }
  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin onSuccess={handleResponse} />
    </div>
  )
}

export default Login
