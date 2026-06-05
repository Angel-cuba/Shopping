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
  // Target the brand link specifically by role + exact name
  const brand = screen.getByRole('link', { name: 'STRIDE' });
  expect(brand).toBeInTheDocument();
});

test('renders the Store navigation link', () => {
  renderApp();
  // Use exact text match — avoids matching "STRIDE Store © 2026" in the Footer
  const storeLink = screen.getByText('Store', { exact: true });
  expect(storeLink).toBeInTheDocument();
});
