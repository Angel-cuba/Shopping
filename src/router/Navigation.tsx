import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import LoadingResponse from '../components/Loading/LoadingResponse';
import UserHistory from '../pages/User/History/UserHistory';
import NotFound from '../pages/Error/NotFound';

const Home          = lazy(() => import('./Home'));
const Profile       = lazy(() => import('../pages/User/Profile'));
const Checkout      = lazy(() => import('../pages/Checkout/Checkout'));
const ProductById   = lazy(() => import('../components/Product/ProductById'));

const AdminLayout      = lazy(() => import('../pages/Admin/AdminLayout'));
const AdminDashboard   = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminOrders      = lazy(() => import('../pages/Admin/AdminOrders'));
const CreateAndCheck   = lazy(() => import('../pages/Admin/CreateAndCheck'));
const Customers        = lazy(() => import('../components/Admin/Customers/Customers'));

const Navigation = () => {
  return (
    <Suspense fallback={<LoadingResponse />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"                      element={<Home />} />
        <Route path="/home"                  element={<Home />} />
        <Route path="/product/:id"           element={<ProductById />} />
        <Route path="/checkout"              element={<Checkout />} />
        <Route path="/checkout/product/:id"  element={<ProductById />} />
        <Route path="/profile"              element={<Profile />} />
        <Route path="/history"              element={<UserHistory />} />

        {/* ── Admin (guard lives inside AdminLayout) ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin"                  element={<AdminDashboard />} />
          <Route path="/admin/orders"           element={<AdminOrders />} />
          <Route path="/admin/customers"        element={<Customers />} />
          <Route path="/admin/products"         element={<CreateAndCheck />} />
          <Route path="/admin/createandcheck"   element={<CreateAndCheck />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Navigation;
