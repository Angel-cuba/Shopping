import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { login } from '../redux/actions/UserAction'
import { UserType } from '../interfaces/user/UserType'
import { Input } from '../components/Input/Input'
import './Login.scss'

const Login = () => {
  const [userLogin, setUserLogin] = React.useState({
    email: '',
    password: ''
  })
  const dispatch = useDispatch<AppDispatch>()

  const handleResponse = (response: any) => {
    if (response.credential) {
      localStorage.setItem('token', response.credential)
      const userDecoded: UserType = jwtDecode(response.credential)
      dispatch(login(userDecoded))
    }
  }
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserLogin({ ...userLogin, [name]: value })
  }
  return (
    <div className="login-view">
      <div className="login-view__container">
        <Input
          name="Email"
          onChange={handlerChange}
          value={userLogin.email}
          placeholder="youremail@gmail.com"
          style={inputStyle}
        />
        <Input
          name="Password"
          onChange={handlerChange}
          value={userLogin.password}
          placeholder="**********"
          style={inputStyle}
        />
        <div className="login-view__container__button">Login</div>
        <GoogleLogin onSuccess={handleResponse} />
      </div>
    </div>
  )
}

export default Login

const inputStyle = {
  width: '230px',
  height: '40px',
  fontSize: '20px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginBottom: '10px'
}
