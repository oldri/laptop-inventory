import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { logout } from "../store/auth/authSlice";
import { authService } from "../services/auth.service";
import type { RootState } from "../store";

export const AuthenticatedLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate("/login");
    };
    console.log("user", user);
    
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <span className="text-lg font-semibold text-gray-900">
                            Laptop Inventory
                        </span>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Welcome, {user?.firstName} {user?.lastName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md shadow"
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
