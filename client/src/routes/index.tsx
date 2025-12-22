import { createBrowserRouter, Navigate } from "react-router-dom";
// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
// Components
import ProtectedRoute from "./ProtectedRoute";
// Pages
import HomePage from "../pages/user/homePage";
import DashboardPage from "../pages/admin/DashboardPage";
import AboutPage from "../pages/user/AboutPage";
import BookingTicket from "../pages/user/BookingTicket";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            }, {
                path: 'bookingTicket',
                element: <BookingTicket />
            },

        ],
    },
    {
        path: "/customer",
        element: <ProtectedRoute requiredRole="CUSTOMER" />,
        children: [
            {
                element: <CustomerLayout />,
                children: [
                    {
                        path: "profile",
                        element: <div>Customer Profile Placeholder</div>,
                    },
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
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/about-page",
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <AboutPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);