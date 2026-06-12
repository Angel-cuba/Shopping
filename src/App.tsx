import React, { useEffect, useLayoutEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import Navigation from './router/Navigation';
import { GlobalTheme } from './context/ThemeProvider';
import { AppDispatch } from './redux/store';
import { logged } from './redux/actions/UserAction';
import { getWishList } from './redux/actions/WishesActions';
import { fetchingAddresses } from './redux/actions/AddressAction';
import { fetchingPayments } from './redux/actions/PaymentAction';
import { decodedUser } from './interfaces/user/UserType';

function App() {
  const { theme } = GlobalTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Session bootstrap — runs ONCE for the entire app lifetime (App never unmounts).
  // Keeping this in App.tsx (not in Home.tsx) prevents a race condition where a
  // getWishList GET started on Home mount could resolve after the user navigated away
  // and made an optimistic wishlist update, overwriting the local state with stale data.
  useLayoutEffect(() => {
    const raw = localStorage.getItem('decodedUser');
    if (!raw) return;
    const parsed = JSON.parse(raw) as decodedUser;
    dispatch(logged(parsed));
    dispatch(getWishList(parsed.user_id));
    dispatch(fetchingAddresses(parsed.user_id));
    dispatch(fetchingPayments(parsed.user_id));
  }, [dispatch]);

  // Sync data-theme attribute with the STRIDE CSS custom property system
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', color: 'var(--color-fg-primary)', transition: 'background-color 220ms' }}>
      <Toaster />
      <Navbar />
      <Navigation />
    </div>
  );
}

export default App;
