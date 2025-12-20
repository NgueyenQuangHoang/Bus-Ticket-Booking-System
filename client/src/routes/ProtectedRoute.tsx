import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole?: 'ADMIN' | 'CUSTOMER';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  // TODO: Implement actual authentication and role checking logic here.
  // For now, we allow access to everything to proceed with development.
  const isAuthenticated = true; 
  const userRole = requiredRole; // Mock role matching

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // return <Navigate to="/unauthorized" replace />; // Or home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
