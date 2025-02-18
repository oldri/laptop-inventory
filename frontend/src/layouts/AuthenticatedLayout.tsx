import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { logout } from "../store/authSlice";
import authService from "../services/auth.service";
import { useEffect, useState, useRef } from "react";
import { Laptop, Users, ClipboardList, UserCircle, LogOut, Menu, X } from "lucide-react";
import { RootState } from "../store";

export const AuthenticatedLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation(); // To watch for route changes

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
        navigate("/login");
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Close dropdown when navigating to a new route
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="text-xl font-bold text-gray-800 flex items-center"
                        >
                            <Laptop className="mr-2" /> Laptop Inventory
                        </Link>

                        {/* Desktop Navbar */}
                        <div className="hidden sm:flex items-center space-x-4">
                            <Link
                                to="/device-management"
                                className="text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                                aria-label="Devices"
                            >
                                <Laptop className="mr-1" /> Devices
                            </Link>
                            {(user?.role === "ROLE_SUPER_ADMIN" || user?.role === "ROLE_ADMIN") && (
                                <Link
                                    to="/device-requests"
                                    className="text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                                    aria-label="Requests"
                                >
                                    <ClipboardList className="mr-1" /> Requests
                                </Link>
                            )}
                            {user?.role === "ROLE_SUPER_ADMIN" && (
                                <Link
                                    to="/user-management"
                                    className="text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                                    aria-label="Users"
                                >
                                    <Users className="mr-1" /> Users
                                </Link>
                            )}
                            {/* Welcome Message */}
                            <span className="text-gray-600 flex items-center">
                                Hello, {user?.firstName} {user?.lastName}
                            </span>

                            {/* User Icon Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full focus:outline-none transition duration-200"
                                    aria-label="User Menu"
                                >
                                    <UserCircle className="w-6 h-6 text-gray-700" />
                                    <span>Account</span>
                                </button>
                                {dropdownOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-10"
                                    >
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                                            aria-label="Profile"
                                        >
                                            <UserCircle className="mr-2" /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                                            aria-label="Logout"
                                        >
                                            <LogOut className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navbar */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-700 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white shadow-md">
                    <Link
                        to="/device-management"
                        className="block text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                    >
                        Devices
                    </Link>
                    {(user?.role === "ROLE_SUPER_ADMIN" || user?.role === "ROLE_ADMIN") && (
                        <Link
                            to="/device-requests"
                            className="block text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                        >
                            Requests
                        </Link>
                    )}
                    {user?.role === "ROLE_SUPER_ADMIN" && (
                        <Link
                            to="/user-management"
                            className="block text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                        >
                            Users
                        </Link>
                    )}
                    <div className="border-t border-gray-200">
                        <Link
                            to="/profile"
                            className="block text-blue-500 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-200"
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
