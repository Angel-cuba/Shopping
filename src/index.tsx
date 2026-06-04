import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { store } from './redux/store';
import { ThemeProvider, GlobalTheme } from './context/ThemeProvider';
import { lightThemeStride, darkThemeStride } from './theme/theme';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

// MUI ThemeProvider bridge: reads the stride theme from ThemeContext
function MuiBridge({ children }: { children: React.ReactNode }) {
  const { theme } = GlobalTheme();
  const muiTheme = theme === 'dark' ? darkThemeStride : lightThemeStride;
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <MuiBridge>
      <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </MuiBridge>
  </ThemeProvider>
);
