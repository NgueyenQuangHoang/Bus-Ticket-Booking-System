import { createBrowserRouter, Navigate } from "react-router-dom";
// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
// Components
import ProtectedRoute from "./ProtectedRoute";
// Pages
import HomePage from "../pages/public/HomePage";
import DashboardPage from "../pages/admin/DashboardPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            }
        ]
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
                        element: <div>Customer Profile Placeholder</div>
                    }
                ]
            }
        ]
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
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: "dashboard",
                        element: <DashboardPage />
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);