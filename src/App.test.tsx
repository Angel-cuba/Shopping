import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import App from './App';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeProvider';
import { lightThemeStride } from './theme/theme';

// Wrap App with all required providers for testing
function renderApp() {
  return render(
    <ThemeProvider>
      <MuiThemeProvider theme={lightThemeStride}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

test('renders the STRIDE navbar brand', () => {
  renderApp();
  // The new Navbar renders the brand name "STRIDE"
  const brand = screen.getByText(/stride/i);
  expect(brand).toBeInTheDocument();
});

test('renders the Store navigation link', () => {
  renderApp();
  const storeLink = screen.getByText(/store/i);
  expect(storeLink).toBeInTheDocument();
});
