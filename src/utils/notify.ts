import { toast } from "react-toastify";

export const notify = () => toast.error('Please fill all the fields', {
    position: toast.POSITION.TOP_LEFT,
    icon: '❌',
    autoClose: 2000, 
  });

  export const notifyEmptyFields = () => toast.error('Please fill all the fields', {
    position: toast.POSITION.TOP_LEFT,
    icon: '❌',
    autoClose: 2000,
  });

  export const notifyError = () => toast.error('Error', {
    position: toast.POSITION.TOP_LEFT,
    icon: '❌',
    autoClose: 2000,
  });

  export const notifyRedirectToHome = (name: string) => toast.success(`Welcome ${name}, you have been redirected`, {
    position: toast.POSITION.TOP_LEFT,
    icon: '🚀',
    autoClose: 2000,
  });

  export const notifyCredentialsAcepeted = () => toast.success('Credentials accepted', {
    position: toast.POSITION.TOP_CENTER,
    icon: '📡',
    autoClose: 2000,
  });

