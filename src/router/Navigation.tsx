import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import LoadingResponse from '../components/Loading/LoadingResponse';
import UserHistory from '../pages/User/History/UserHistory';
import NotFound from '../pages/Error/NotFound';

const Home          = lazy(() => import('./Home'));
const Profile       = lazy(() => import('../pages/User/Profile'));
const Checkout      = lazy(() => import('../pages/Checkout/Checkout'));
const ProductById   = lazy(() => import('../components/Product/ProductById'));
const Wishlist      = lazy(() => import('../pages/Wishlist/Wishlist'));

const Privacy    = lazy(() => import('../pages/Info/Privacy'));
const Terms      = lazy(() => import('../pages/Info/Terms'));
const Contact    = lazy(() => import('../pages/Info/Contact'));
const FAQ        = lazy(() => import('../pages/Info/FAQ'));
const Shipping   = lazy(() => import('../pages/Info/Shipping'));
const SizeGuide  = lazy(() => import('../pages/Info/SizeGuide'));

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
        <Route path="/products"              element={<Home />} />
        <Route path="/product/:id"           element={<ProductById />} />
        <Route path="/checkout"              element={<Checkout />} />
        <Route path="/checkout/product/:id"  element={<ProductById />} />
        <Route path="/profile"              element={<Profile />} />
        <Route path="/history"              element={<UserHistory />} />
        <Route path="/wishlist"             element={<Wishlist />} />
        <Route path="/privacy"             element={<Privacy />} />
        <Route path="/terms"               element={<Terms />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="/faq"                 element={<FAQ />} />
        <Route path="/shipping"            element={<Shipping />} />
        <Route path="/size-guide"          element={<SizeGuide />} />

        {/* ── Admin (guard lives inside AdminLayout) ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin"                  element={<AdminDashboard />} />
          <Route path="/admin/orders"           element={<AdminOrders />} />
          <Route path="/admin/customers"        element={<Customers />} />
          <Route path="/admin/products"  element={<CreateAndCheck />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Navigation;
