import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Components
import ProtectedRoute from "./ProtectedRoute";

// Pages
// import HomePage from "../pages/user/HomePage";
import BookingTicket from "../pages/user/booking/BookingTicket";
import AboutPage from "../pages/user/about/AboutPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BusCompanyPage from "../pages/user/bus_company/BusCompanyPage";
import BusCompanyDetailPage from "../pages/user/bus_company/[slug]/BusCompanyDetailPage";
import HomePage from "../pages/user/home/HomePage";
import BusStationPage from "../pages/user/bus_station/BusStationPage";
import RoutesPage from "../pages/user/routes/RoutesPage";
import RouteDetailPage from "../pages/user/routes/[slug]/RouteDetailPage";
import CheckTicket from "../pages/user/check_ticket/CheckTicket";
import BookingConfirmation from "../pages/user/booking/[tripId]/BookingConfirmation";
import AccountProfile from "../pages/user/profile/AccountProfile";
import { AuthPage } from "../pages/admin/auth/AdminLoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "bookingTicket", element: <BookingTicket /> },
      { path: "about-page", element: <AboutPage /> },
      { path: "busCompany", element: <BusCompanyPage /> },
      { path: "busStation", element: <BusStationPage /> },
      { path: "routes", element: <RoutesPage /> },
      { path: "detailBusCompany", element: <BusCompanyDetailPage /> },
      { path: "detailRoute", element: <RouteDetailPage /> },
      { path: "bookingConfirmation", element: <BookingConfirmation /> },
      { path: "check-ticket", element: <CheckTicket /> },

      { path: "accountProfile", element: <AccountProfile /> },

    ],
  },
  {
    path: "/customer",
    element: <ProtectedRoute requiredRole="CUSTOMER" />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "bookingTicket", element: <BookingTicket /> },
          { path: "about-page", element: <AboutPage /> },
          { path: "busCompany", element: <BusCompanyPage /> },
          { path: "busStation", element: <BusStationPage /> },
          { path: "routes", element: <RoutesPage /> },
          { path: "detailBusCompany", element: <BusCompanyDetailPage /> },
          { path: "detailRoute", element: <RouteDetailPage /> },
          { path: "check-ticket", element: <CheckTicket /> }




        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="ADMIN" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin/auth",
    element: <AuthPage />,
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);