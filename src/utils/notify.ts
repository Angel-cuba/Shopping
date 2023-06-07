import { toast } from "react-toastify";

export const notifyDelete = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 1600,
    style: {
      backgroundColor: '#FF0000',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '5px',
      textAlign: 'center'
    }, 
  });

  export const notifyWarning = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 1600,
    style: {
      backgroundColor: '#102F09',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '5px',
      textAlign: 'center'
    }, 
  });


  export const notifyEmptyFields = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    icon: '❌',
    autoClose: 2000,
  });

  export const notifyError = (error: string) => toast.error(error, {
    position: toast.POSITION.TOP_RIGHT,
    icon: '❌',
    autoClose: 1600,
  });

  export const notifySuccess = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    icon: '🚀',
    autoClose: 1600,
  });

  export const notifyRedirectToLogin = () => toast.success('You have been redirected to login', {
    position: toast.POSITION.TOP_CENTER,
    icon: '🚀',
    autoClose: 2000,
  });

  export const notifyRedirectToProfile = () => toast.success('You have been redirected to profile', {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 2000,
  });


  export const notifyRedirectToHome = (name: string) => toast.success(`Welcome back ${name}, you have been redirected`, {
    position: toast.POSITION.TOP_LEFT,
    icon: '🚀',
    autoClose: 2000,
  });

  export const notifyRedirectToHomeAfterRegister = (name: string) => toast.success(`Welcome ${name}, you have been redirected`, {
    position: toast.POSITION.TOP_LEFT,
    icon: '🚀',
    autoClose: 2000,
  });

  export const notifyCredentialsAcepeted = () => toast.success('Credentials accepted', {
    position: toast.POSITION.TOP_CENTER,
    icon: '📡',
    autoClose: 2000,
  });

