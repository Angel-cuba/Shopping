import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import LoadingResponse from '../components/Loading/LoadingResponse';
import { isAdmin, isUserAuthenticated } from '../utils/authentication';
import UserHistory from '../pages/User/History/UserHistory';

const Home = lazy(() => import('./Home'));
const Profile = lazy(() => import('../pages/User/Profile'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders'));
const CreateAndCheck = lazy(() => import('../pages/Admin/CreateAndCheck'));
const ProductById = lazy(() => import('../components/Product/ProductById'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const Customers = lazy(() => import('../components/Admin/Customers/Customers'));

const Navigation = () => {
  return (
    <Suspense fallback={<LoadingResponse />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductById />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/product/:id" element={<ProductById />} />

        {isUserAuthenticated() && <>
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<UserHistory />} />
        </>}
        {isAdmin() && isUserAuthenticated() ? (
          <>
            <Route path="/admin/products" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/createandcheck" element={<CreateAndCheck />} />
            <Route path="/admin/createandcheck/check" element={<CreateAndCheck />} />
          </>
        ) : null}
      </Routes>
    </Suspense>
  );
};

export default Navigation;
