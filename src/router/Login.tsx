import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { login } from '../redux/actions/UserAction'
import { UserType } from '../interfaces/user/UserType'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleResponse = (response: any) => {
    if (response.credential) {
      const token = `${response.credential}`
      const userDecoded: UserType = jwtDecode(response.credential)
      dispatch(login(userDecoded))
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin onSuccess={handleResponse} />
    </div>
  )
}

export default Login
