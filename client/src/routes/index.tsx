import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Components
import ProtectedRoute from "./ProtectedRoute";

// Pages
// import HomePage from "../pages/user/HomePage";
import BookingTicket from "../pages/user/BookingTicket";
import AboutPage from "../pages/user/AboutPage";
import DashboardPage from "../pages/admin/DashboardPage";
import BusCompanyPage from "../pages/user/bus_company/BusCompanyPage";
import BusCompanyDetailPage from "../pages/user/bus_company/BusCompanyDetailPage";
import HomePage from "../pages/user/homePage";
import BusStationPage from "../pages/user/bus_station/BusStationPage";
import RoutesPage from "../pages/user/route/RoutesPage";
import RouteDetailPage from "../pages/user/route/RouteDetailPage";

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
            { path: "detailRoute", element: <RouteDetailPage /> }



        ],
    },
    {
        path: "/customer",
        element: <ProtectedRoute requiredRole="CUSTOMER" />,
        children: [
            {
                element: <CustomerLayout />,
                children: [
                    { path: "profile", element: <div>Customer Profile Placeholder</div> },
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

    { path: "*", element: <Navigate to="/" replace /> },
]);
