import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { login } from '../redux/actions/UserAction'
import { UserType } from '../interfaces/user/UserType'
import { Input } from '../components/Input/Input'
import { useNavigate } from 'react-router-dom'
import './Login.scss'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleResponse = (response: any) => {
    if (response.credential) {
      localStorage.setItem('token', response.credential)
      const userDecoded: UserType = jwtDecode(response.credential)
      dispatch(login(userDecoded))
      navigate('/')
    }
  }
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'Email') {
      setEmail(e.target.value)
    } else {
      setPassword(e.target.value)
    }
  }
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('submit', email, password)
  }
  return (
    <div className="login-view">
      <div className="login-view__container">
        <Input
          name="Email"
          onChange={handlerChange}
          value={email}
          placeholder="youremail@gmail.com"
          style={inputStyle}
        />
        <Input
          name="Password"
          onChange={handlerChange}
          value={password}
          placeholder="**********"
          style={inputStyle}
        />
        <button className="login-view__container__button" onClick={handlerSubmit}>
          Login
        </button>
        <GoogleLogin onSuccess={handleResponse} onError={() => console.log('Failed')} />
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
