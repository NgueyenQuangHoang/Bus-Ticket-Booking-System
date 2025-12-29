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
// import admin from "pages/admin"
import UsersPage from "../pages/admin/users/UsersPage";
import RolesPage from "../pages/admin/users/roles/RolesPage";
import UserPermissionsPage from "../pages/admin/users/permissions/UserPermissionsPage";
import SchedulesPage from "../pages/admin/schedules/SchedulesPage";
import CitiesPage from "../pages/admin/locations/cities/CitiesPage";
import StationsPage from "../pages/admin/locations/stations/StationsPage";
import AdminRoutesPage from "../pages/admin/locations/routes/RoutesPage";
import BusCompaniesPage from "../pages/admin/vehicles/companies/BusCompaniesPage";
import BusesPage from "../pages/admin/vehicles/buses/BusesPage";
import BusImagesPage from "../pages/admin/vehicles/images/BusImagesPage";
import SeatTypesPage from "../pages/admin/seats/layouts/components/SeatTypesPage";
import SeatLayoutPage from "../pages/admin/seats/layouts/components/SeatLayoutPage";
import SeatStatusPage from "../pages/admin/seats/status/SeatStatusPage";
import SeatLayoutTemplatePage from "../pages/admin/seats/layouts/components/SeatLayoutTemplatePage";
import TicketsPage from "../pages/admin/tickets/TicketsPage";
import PaymentGatewaysPage from "../pages/admin/payments/PaymentGateways/PaymentGatewaysPage";
import TransactionsPage from "../pages/admin/payments/Transactions/TransactionsPage";
import CancellationPoliciesPage from "../pages/admin/policies/CancellationPoliciesPage";
import ReviewsPage from "../pages/admin/reviews/ReviewsPage";
import BannersPage from "../pages/admin/banners/BannersPage";

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
          { path: "check-ticket", element: <CheckTicket /> },
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
          { path: "users", element: <UsersPage /> },
          { path: "roles", element: <RolesPage /> },
          { path: "permissions", element: <UserPermissionsPage /> },
          { path: "schedules", element: <SchedulesPage /> },
          { path: "cities", element: <CitiesPage /> },
          { path: "stations", element: <StationsPage /> },
          { path: "routes", element: <AdminRoutesPage /> },
          { path: "bus-companies", element: <BusCompaniesPage /> },
          { path: "buses", element: <BusesPage /> },
          { path: "bus-images", element: <BusImagesPage /> },
          { path: "seat-types", element: <SeatTypesPage /> },
          { path: "seat-maps", element: <SeatLayoutPage /> },
          { path: "seat-templates", element: <SeatLayoutTemplatePage /> },
          { path: "seat-status", element: <SeatStatusPage /> },
          { path: "tickets", element: <TicketsPage /> },
          { path: "payment-gateways", element: <PaymentGatewaysPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "cancellation-policies", element: <CancellationPoliciesPage /> },
          { path: "reviews", element: <ReviewsPage /> },
          { path: "banners", element: <BannersPage /> },
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