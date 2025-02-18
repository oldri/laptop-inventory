import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    useParams,
    useNavigate,
} from "react-router-dom";
import { Login } from "../pages/Login";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import DeviceManagement from "../components/device/DeviceManagement";
import DeviceRequestList from "../components/device/DeviceRequestList";
import DeviceRequestDetails from "../components/device/DeviceRequestDetails";
import React, { ReactNode, useEffect, useState } from "react";
import { DeviceRequestDTO } from "../types/deviceRequest";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../components/common/Alert";
import deviceRequestService from "../services/deviceRequest.service";
import { Dashboard } from "../pages/Dashboard";
import UserManagement from "../components/user/UserManagement";
import UserProfile from "../components/user/UserProfile";

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

const DeviceRequestDetailsWrapper = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<DeviceRequestDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                if (!id) {
                    throw new Error("Request ID is missing");
                }

                // Fetch the request details from the backend
                const response =
                    await deviceRequestService.getDeviceRequestById(
                        parseInt(id)
                    );
                setRequest(response.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch request details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertDescription>Request not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <DeviceRequestDetails
            request={request}
            onClose={() => navigate("/device-requests")}
        />
    );
};

export default DeviceRequestDetailsWrapper;

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
                element: <Dashboard />,
            },
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
            {
                path: "user-management",
                element: (
                    <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN"]}>
                        <ErrorBoundary>
                            <UserManagement />
                        </ErrorBoundary>
                    </ProtectedRoute>
                )
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ErrorBoundary>
                            <UserProfile />
                        </ErrorBoundary>
                    </ProtectedRoute>
                )
            },
            {
                path: "device-requests",
                element: (
                    <ProtectedRoute
                        allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}
                    >
                        <ErrorBoundary>
                            <DeviceRequestList />
                        </ErrorBoundary>
                    </ProtectedRoute>
                ),
            },
            {
                path: "device-requests/:id",
                element: (
                    <ProtectedRoute
                        allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}
                    >
                        <ErrorBoundary>
                            <DeviceRequestDetailsWrapper />
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
