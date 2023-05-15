import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/actions/UserAction';
import { UserType } from '../interfaces/user/UserType';
import { Input } from '../components/Input/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import { getTokenFromLocalStorage } from '../utils/token';
import './styles/Login.scss';

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userFromLocalStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const userToken = localStorage.getItem('token');

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleGoogleResponse = (response: any) => {
    if (response.credential) {
      localStorage.setItem('token', response.credential);
      const userDecoded: UserType = jwtDecode(response.credential);
      const userToLocalStorage = JSON.stringify(userDecoded);
      localStorage.setItem('user', userToLocalStorage);
      dispatch(login(userDecoded));
      navigate('/home');
    }
  };
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'Email') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };
  const handleLogin = async () => {
    const postData = {
      username,
      password,
    };
    const request = await axios.post('http://localhost:8080/api/v1/users/signin', postData);
    localStorage.setItem('token', request.data);
    getTokenFromLocalStorage();
    navigate('/home');
  };
  const openSignUp = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {!userFromLocalStorage?.username && !userToken ? (
        <div className="login-view">
          <div className="login-view__container">
            {isLogin ? (
              <div className="login-view__container__login">
                <Input
                  name="Email"
                  onChange={handlerChange}
                  value={username}
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
                <button className="login-view__container__login__button" onClick={handleLogin}>
                  Login
                </button>
              </div>
            ) : null}
            {!isLogin ? (
              <div className="login-view__container__register">
                <Input
                  name="Email"
                  onChange={handlerChange}
                  value={username}
                  placeholder=""
                  style={inputStyle}
                />
                <Input
                  name="Password"
                  onChange={handlerChange}
                  value={password}
                  placeholder=""
                  style={inputStyle}
                />
                <button className="login-view__container__register__button">Sign up</button>
              </div>
            ) : null}
            <div className="login-view__container__text">
              <p>
              {
                isLogin ? 'Don’t have an account? ' : 'Already have an account? '
              }
              <span className="login-view__container__text--span" onClick={openSignUp}>{!isLogin ? 'Login' : 'Sign up'}</span>
            </p>
            </div>
            <div className="login-view__container--login-with-google">
            </div>
            <GoogleLogin onSuccess={handleGoogleResponse} onError={() => console.log('Failed')} />
          </div>
        </div>
      ) : (
        <Home />
      )}
    </>
  );
};

export default Login;

const inputStyle = {
  width: '230px',
  height: '30px',
  fontSize: '20px',
  padding: '10px',
  borderRadius: '5px',
  border: 'none',
  marginBottom: '10px',
  boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
};
