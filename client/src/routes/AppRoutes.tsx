import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 
        GUEST Routes (Path: /)
        Accessible by everyone, shows CustomerLayout
      */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        {/* Add verify/search/details routes here */}
      </Route>

      {/* 
        CUSTOMER Routes (Path: /customer)
        Protected for logged-in Users
      */}
      <Route path="/customer" element={<ProtectedRoute requiredRole="CUSTOMER" />}>
        <Route element={<CustomerLayout />}>
           {/* Example: /customer/profile, /customer/history */}
           <Route path="profile" element={<div>Customer Profile Placeholder</div>} />
        </Route>
      </Route>


      {/* 
        AUTH Routes (Path: /auth)
        Login/Register logic
      */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<div>Register Page Placeholder</div>} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* 
        ADMIN Routes (Path: /admin)
        Protected for Admins
      */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
