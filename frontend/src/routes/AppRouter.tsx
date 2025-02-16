import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import DeviceManagement from "../components/device/DeviceManagement";
import { ReactNode } from "react";
import React from "react";

export class ErrorBoundary extends React.Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-red-500">
                    Error loading device management
                </div>
            );
        }
        return this.props.children;
    }
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <AuthenticatedLayout />,
        children: [
            {
                index: true,
                element: <DeviceManagement />,
            },
            // {
            //     path: "dashboard",
            //     element: (
            //         <ProtectedRoute>
            //             <Dashboard />
            //         </ProtectedRoute>
            //     ),
            // },
            // {
            //     path: "admin",
            //     element: (
            //         <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}>
            //             <AdminDashboard />
            //         </ProtectedRoute>
            //     ),
            // },
            {
                path: "device-management",
                element: (
                    <ProtectedRoute
                        allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}
                    >
                        <ErrorBoundary>
                            <DeviceManagement />
                        </ErrorBoundary>
                    </ProtectedRoute>
                ),
            },
            // Wildcard route to redirect invalid routes
            {
                path: "*",
                element: <Navigate to="/device-management" />,
            },
        ],
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
