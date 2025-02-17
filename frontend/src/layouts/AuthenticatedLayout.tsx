import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { logout } from "../store/authSlice";
import authService from "../services/auth.service";
import type { RootState } from "../store";
import { useEffect } from "react";

export const AuthenticatedLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]); // Add `navigate` as a dependency

    if (!user) {
        return null; // or a loading spinner, or a message
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="text-xl font-bold text-gray-800"
                        >
                            Laptop Inventory
                        </Link>
                        <div className="flex items-center space-x-6">
                            {/* Navigation Links */}
                            <Link
                                to="/device-management"
                                className="text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                            >
                                Devices
                            </Link>
                            {(user?.role === "ROLE_SUPER_ADMIN" ||
                                user?.role === "ROLE_ADMIN") && (
                                <Link
                                    to="/device-requests"
                                    className="text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                                >
                                    Requests
                                </Link>
                            )}
                            <span className="text-gray-600">
                                Welcome, {user?.firstName} {user?.lastName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md shadow transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
