import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/actions/UserAction';
import { UserType } from '../interfaces/user/UserType';
import { Input } from '../components/Input/Input';
import { useNavigate } from 'react-router-dom';
import { getTokenFromLocalStorage } from '../utils/token';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Home from './Home';
import axios from 'axios';
import './styles/Login.scss';
import LoadingLogin from '../components/Loading/LoadingLogin';

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const [newUser, setNewUser] = React.useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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
    if (e.target.name === 'Username') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'user Name') {
      setNewUser({ ...newUser, username: e.target.value });
    } else if (e.target.name === 'first Name') {
      setNewUser({ ...newUser, firstname: e.target.value });
    } else if (e.target.name === 'last Name') {
      setNewUser({ ...newUser, lastname: e.target.value });
    } else if (e.target.name === 'email') {
      setNewUser({ ...newUser, email: e.target.value });
    } else if (e.target.name === 'phone') {
      setNewUser({ ...newUser, phone: e.target.value });
    } else {
      setNewUser({ ...newUser, password: e.target.value });
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      //TODO: cambiar esto por un toast
      alert('please fill all the fields');
      return;
    }
    const postData = {
      username,
      password,
    };
    const request = await axios.post(
      'https://shopping-bhjf.onrender.com/api/v1/users/signin',
      postData
    );
    if (request.status !== 200) {
      //TODO: cambiar esto por un
      alert('User not found');
      setLoading(false);
      return;
    } else {
    setLoading(true);
    localStorage.setItem('token', request.data);
    getTokenFromLocalStorage();
    navigate('/home');
    }
    setLoading(false);

  };
  const openSignUp = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = async () => {
    if (
      !newUser.username ||
      !newUser.firstname ||
      !newUser.lastname ||
      !newUser.email ||
      !newUser.phone ||
      !newUser.password
    ) {
      alert('please fill all the fields');
      return;
    }
    if (newUser.password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }
    const postData = {
      username: newUser.username,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
    };
    const request = await axios.post(
      'https://shopping-bhjf.onrender.com/api/v1/users/signup',
      postData
    );
    console.log(request);
    localStorage.setItem('token', request.data);
    getTokenFromLocalStorage();
    navigate('/');
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <LoadingLogin />;

  return (
    <>
      {!userFromLocalStorage?.username && !userToken ? (
        <div className="login-view">
          <div className="login-view__container">
            {isLogin ? (
              <div className="login-view__container__login">
                <Input
                  name="Username"
                  onChange={handlerChange}
                  value={username}
                  placeholder="Username"
                  style={inputStyle}
                />
                <div className="login-view__container__login--input-password">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="Password"
                    onChange={handlerChange}
                    value={password}
                    placeholder="**********"
                    style={inputStyle}
                  />
                  <div
                    onClick={handleShowPassword}
                    className="login-view__container__login--input-password__icon"
                  >
                    {!showPassword ? (
                      <Visibility style={{ fontSize: '1.6rem' }} />
                    ) : (
                      <VisibilityOff style={{ fontSize: '1.6rem' }} />
                    )}
                  </div>
                </div>
                <button className="login-view__container__login__button" onClick={handleLogin}>
                  Login
                </button>
              </div>
            ) : null}
            {!isLogin ? (
              <div className="login-view__container__register">
                <Input
                  name="user Name"
                  onChange={handleRegisterChange}
                  value={newUser.username}
                  placeholder="User Name"
                  style={inputStyle}
                />{' '}
                <Input
                  name="first Name"
                  onChange={handleRegisterChange}
                  value={newUser.firstname}
                  placeholder="First Name"
                  style={inputStyle}
                />{' '}
                <Input
                  type="email"
                  name="email"
                  onChange={handleRegisterChange}
                  value={newUser.email}
                  placeholder="Email"
                  style={inputStyle}
                />{' '}
                <Input
                  name="last Name"
                  onChange={handleRegisterChange}
                  value={newUser.lastname}
                  placeholder="Last Name"
                  style={inputStyle}
                />
                <div className="login-view__container__register--show-password">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleRegisterChange}
                    value={newUser.password}
                    placeholder="Password"
                    style={inputStyle}
                  />
                  <div
                    onClick={handleShowPassword}
                    className="login-view__container__register--show-password__icon"
                  >
                    {!showPassword ? (
                      <Visibility style={{ fontSize: '1.6rem' }} />
                    ) : (
                      <VisibilityOff style={{ fontSize: '1.6rem' }} />
                    )}
                  </div>
                </div>
                <Input
                  name="phone"
                  onChange={handleRegisterChange}
                  value={newUser.phone}
                  placeholder="Phone Number"
                  style={inputStyle}
                />
                <div className="login-view__container__register--show-password">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="Confirm Password"
                    onChange={handleConfirmPassword}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    style={inputStyle}
                  />
                </div>
                <button
                  className="login-view__container__register__button"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            ) : null}
            <div className="login-view__container__text">
              <p>
                {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
                <span className="login-view__container__text--span" onClick={openSignUp}>
                  {!isLogin ? 'Login' : 'Sign up'}
                </span>
              </p>
            </div>
            <div className="login-view__container__separator"></div>
            <div className="login-view__container--login-with-google"></div>
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
