import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: Array<"SUPER_ADMIN" | "ADMIN" | "EMPLOYEE">;
}

export const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
