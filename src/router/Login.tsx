import React, { useEffect } from 'react';
import { Input } from '../components/Input/Input';
import { useNavigate } from 'react-router-dom';
import { getTokenFromLocalStorage } from '../utils/token';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingLogin from '../components/Loading/LoadingLogin';
import { Toaster } from 'react-hot-toast';
import { handleToast } from '../utils/notifications';
import { ToastContainer } from 'react-toastify';
import { notifyEmptyFields, notifyError, notifyRedirectToHome, notifySuccess } from '../utils/notify';
import { apiWithoutAuth } from '../utils/api';
import './styles/Login.scss';

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

  const userNameCapitalized = username.charAt(0).toUpperCase() + username.slice(1);

  const navigate = useNavigate();

  const userFromLocalStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const userToken = localStorage.getItem('token');

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleGoogleResponse = ( )=> {
   notifyError('Google login is not available');
   setTimeout(() => {
    notifySuccess('Try using your username and password');
    }, 2200);
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
      notifyEmptyFields('Please fill all the fields');
      return;
    }
    const postData = {
      username,
      password,
    };
    try {
      const request = await apiWithoutAuth.post('/users/signin', postData);
      if (request.status === 200) {
        setLoading(true);
        localStorage.setItem('token', request.data);
        getTokenFromLocalStorage();
      }
      notifyRedirectToHome(userNameCapitalized);
      setTimeout(() => {
        redirectToHome();
      }, 2200);
    } catch (error: any) {
      if (error.response.status === 401) {
        handleToast('Error 401', `${error.response.data}`);
      }
    }
    setLoading(false);
  };

  const redirectToHome = () => {
    navigate('/');
    window.location.reload()
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
      handleToast('Empty fields', 'Please fill all the fields');
      return;
    }
    if (newUser.password !== confirmPassword) {
      notifyError('Passwords do not match');
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
    const request = await apiWithoutAuth.post('/users/signup', postData);
    localStorage.setItem('token', request.data);
    getTokenFromLocalStorage();
    navigate('/');
    window.location.reload()
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
            <p className="login-view__container__text">  
                {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
                <span className="login-view__container__text--span" onClick={openSignUp}>
                  {!isLogin ? 'Login' : 'Sign up'}
                </span>
            </p>
            <div className="login-view__container__separator"></div>
            <div className="login-view__container__login-with-google" onClick={handleGoogleResponse}>
              {' '}
              <Google
                style={{
                  fontSize: '1.6rem',
                  marginRight: '3px',
                  color: '#4285F4',
                }}
              />{' '}
              Iniciar sesión con Google
            </div>
          </div>
        </div>
      ) : null}
      <Toaster />
      <ToastContainer />
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
