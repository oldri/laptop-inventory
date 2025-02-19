import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import {
    fetchUsers,
    deleteUser,
} from "../../store/userSlice";
import {
    UserDTO,
    UserRole,
    Department,
    UserSearchParams,
} from "../../types/user";
import UserForm from "./UserForm";
import {
    AlertCircle,
    RefreshCw,
    Plus,
    Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "../common/Alert";
import UserTable from "./UserTable";

const UserManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error } = useSelector(
        (state: RootState) => state.users
    );

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = users.pageSize || 10;
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
    const [searchParams, setSearchParams] = useState<UserSearchParams>({});
    const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);

    useEffect(() => {
        dispatch(fetchUsers({
            page: currentPage,
            size: pageSize,
            ...searchParams
        }));
    }, [dispatch, currentPage, pageSize, searchParams]);

    const handleSearchParamsChange = (newParams: Partial<UserSearchParams>) => {
        setCurrentPage(0);
        setSearchParams(prev => ({ ...prev, ...newParams }));
    };

    const handleClearFilters = () => {
        setCurrentPage(0);
        setSearchParams({});
    };

    const getRoleBadgeClass = (role: UserRole) => {
        const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
        switch (role) {
            case "ROLE_SUPER_ADMIN":
                return `${baseClass} bg-purple-100 text-purple-800`;
            case "ROLE_ADMIN":
                return `${baseClass} bg-blue-100 text-blue-800`;
            case "ROLE_EMPLOYEE":
                return `${baseClass} bg-green-100 text-green-800`;
        }
    };

    const getStatusBadge = (isActive: boolean) => (
        <span className={`px-3 py-1 rounded-full text-sm ${isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}>
            {isActive ? "Active" : "Inactive"}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50 rounded-xl">

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        User Management
                    </h1>
                    <div className="flex gap-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            onClick={() => dispatch(fetchUsers({
                                page: currentPage,
                                size: pageSize,
                                ...searchParams
                            }))}
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            onClick={() => {
                                setEditingUser(null);
                                setShowUserModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="!mt-0">{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-6 flex gap-4">
                    <select
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.role || ""}
                        onChange={(e) => handleSearchParamsChange({
                            role: (e.target.value as UserRole) || undefined
                        })}
                    >
                        <option value="">All Roles</option>
                        <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_EMPLOYEE">Employee</option>
                    </select>
                    <select
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.department || ""}
                        onChange={(e) => handleSearchParamsChange({
                            department: (e.target.value as Department) || undefined
                        })}
                    >
                        <option value="">All Departments</option>
                        <option value="HR">HR</option>
                        <option value="TECH">Tech</option>
                        <option value="CONSULTING">Consulting</option>
                        <option value="MANAGEMENT">Management</option>
                        <option value="FINANCE">Finance</option>
                        <option value="OPERATIONS">Operations</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search by name/email"
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.search || ""}
                        onChange={(e) => handleSearchParamsChange({
                            search: e.target.value || undefined
                        })}
                    />
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                <UserTable
                    users={users.content}
                    loading={loading}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalElements={users.totalElements}
                    onPageChange={setCurrentPage}
                    onEditUser={(user) => {
                        setEditingUser(user);
                        setShowUserModal(true);
                    }}
                    onDeleteUser={setUserToDelete}
                    roleBadgeClass={getRoleBadgeClass}
                    statusBadge={getStatusBadge}
                />

                {/* User Modal */}
                {showUserModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingUser ? "Edit User" : "Add User"}
                            </h2>
                            <UserForm
                                initialData={editingUser}
                                onClose={() => setShowUserModal(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {userToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2">
                            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete the following user?
                            </p>
                            <div className="mb-4 overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {userToDelete.firstName} {userToDelete.lastName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {userToDelete.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getRoleBadgeClass(userToDelete.role)}>
                                                    {userToDelete.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {userToDelete.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(userToDelete.isActive)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                                    onClick={() => setUserToDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                                    onClick={async () => {
                                        try {
                                            await dispatch(deleteUser(userToDelete.id)).unwrap();
                                            setUserToDelete(null);
                                            dispatch(fetchUsers({
                                                page: currentPage,
                                                size: pageSize,
                                                ...searchParams
                                            }));
                                        } catch (error) {
                                            console.error("Delete failed:", error);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;