import { JSX } from "react";
import { UserDTO, UserRole } from "../../types/user";
import { Edit2, RefreshCw, Trash2 } from "lucide-react";

interface UserTableProps {
    users: UserDTO[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onEditUser: (user: UserDTO) => void;
    onDeleteUser: (user: UserDTO) => void;
    roleBadgeClass: (role: UserRole) => string;
    statusBadge: (isActive: boolean) => JSX.Element;
}

const UserTable = ({
    users,
    loading,
    currentPage,
    pageSize,
    totalElements,
    onPageChange,
    onEditUser,
    onDeleteUser,
    roleBadgeClass,
    statusBadge
}: UserTableProps) => {
    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User Details
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center">
                                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {user.email}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            @{user.username}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={roleBadgeClass(user.role)}>
                                        {user.role.replace("ROLE_", "")}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-900">
                                        {user.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {statusBadge(user.isActive)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditUser(user)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit user"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteUser(user)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete user"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between px-6 py-3 bg-white border-t">
                <div className="text-sm text-gray-500">
                    Showing {users.length} of {totalElements} users
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(i)}
                            className={`px-3 py-1 rounded-lg border ${currentPage === i
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;