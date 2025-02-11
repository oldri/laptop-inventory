import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { ProtectedRoute } from "../routes/ProtectedRoute";

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
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
