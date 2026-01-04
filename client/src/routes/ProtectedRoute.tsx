import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredIsLogin, getStoredRole } from '../utils/authStorage';
import {
  DEFAULT_BUS_COMPANY_ADMIN_PATH,
  isBusCompanyAdminPath,
  type RoleName,
} from '../utils/roleAccess';

interface ProtectedRouteProps {
  requiredRoles?: RoleName[];
  redirectTo?: string;
}

const ProtectedRoute = ({ requiredRoles, redirectTo }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = getStoredIsLogin();
  const userRole = getStoredRole() as RoleName | null;

  if (!isAuthenticated) {
    const isAdminArea = (requiredRoles || []).some(
      (role) => role === "ADMIN" || role === "BUS_COMPANY"
    );
    return <Navigate to={isAdminArea ? "/admin/auth" : "/"} replace />;
  }

  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    // return <Navigate to="/unauthorized" replace />; // Or home
    return <Navigate to={redirectTo ?? "/"} replace />;
  }

  if (userRole === "BUS_COMPANY" && location.pathname.startsWith("/admin")) {
    if (!isBusCompanyAdminPath(location.pathname)) {
      return <Navigate to={DEFAULT_BUS_COMPANY_ADMIN_PATH} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
