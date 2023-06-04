import { toast } from 'react-hot-toast';

const handleEmptyFields = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    duration: 2000,
    style: {
      background: '#00E4E81F',
      color: '#0f0f0f',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '👨🏾‍💻',
  });
};
const handleHold = () => {
  toast.success('Wait a second..., we are deleting this product', {
    position: 'top-center',
    duration: 2000,
    style: {
      background: '#e80000',
      color: '#9c9c9c',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '❌',
  });
};
const handleMessage = () => {
  toast.success('Redirecting after message', {
    position: 'top-center',
    duration: 3000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '✈️',
  });
};

const handleError = () => {
  toast.success('Something went wrong, please try again', {
    position: 'top-right',
    duration: 3000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '⏳',
  });
};

const handleNetworkError = () => {
  toast.success('There is a network error, please try later', {
    position: 'top-left',
    duration: 3000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '📡',
  });
};

const handleBan = () => {
  toast.success('With this you will ban this user', {
    position: 'top-left',
    duration: 2000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '📡',
  });
};

const handleSave = () => {
  toast.success('Wait a second, we are saving...', {
    position: 'top-left',
    duration: 2000,
    style: {
      background: '#565b5a',
      color: '#ffdcdc',
      textShadow: '0px 0px 10px #5a5a5ac3',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '🚀',
  });
};

const handleEmpty = () => {
  toast.success('Your cart is empty', {
    position: 'top-center',
    duration: 2000,
    style: {
      background: '#5c5876',
      color: '#8a7878',
      textShadow: '0px 0px 5px #40506532',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '🗽',
  });
};

const handleRedirect = () => {
  toast.success('Redirecting to home page...', {
    position: 'top-right',
    duration: 2000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '🚀',
  });
};
const handleChecking = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    duration: 2000,
    style: {
      background: '#360000',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '🚀',
  });
};
const handleError401 = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    duration: 2000,
    style: {
      background: '#FF0000C2',
      color: '#ffffff',
      textShadow: '0px 0px 10px #c8c8c8c3',
      border: 'none',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
    icon: '🚀',
  });
};

export const handleToast = (options: string, message: string) => {
  if (options === 'Empty fields') {
    handleEmptyFields(message);
  }
  if (options === 'Deleting product') {
    handleHold();
  }
  if (options === 'Message') {
    handleMessage();
  }
  if (options === 'Error') {
    handleError();
  }
  if (options === 'Network error') {
    handleNetworkError();
  }
  if (options === 'Ban an user') {
    handleBan();
  }
  if (options === 'Save') {
    handleSave();
  }
  if (options === 'Empty cart') {
    handleEmpty();
  }
  if (options === 'Welcome') {
    handleRedirect();
  }
  if (options === 'Checking') {
    handleChecking(message);
  }
  if (options === 'Error 401') {
    handleError401(message);
  }
};
