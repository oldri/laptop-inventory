import { useEffect, useState } from "react";
import { UserDTO, UserCreateDTO, UserRole, Department } from "../../types/user";
import { useDispatch } from "react-redux";
import { createUser, updateUser } from "../../store/userSlice";
import { AppDispatch } from "../../store";

interface UserFormProps {
    initialData?: UserDTO | null;
    onClose: () => void;
}

const UserForm = ({ initialData, onClose }: UserFormProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<UserCreateDTO>({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "ROLE_EMPLOYEE",
        department: "TECH",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                password: "" // Don't pre-fill password
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                await dispatch(updateUser({
                    id: initialData.id,
                    data: formData
                })).unwrap();
            } else {
                await dispatch(createUser(formData)).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Form submission failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        required={!initialData}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    >
                        <option value="HR">HR</option>
                        <option value="TECH">Tech</option>
                        <option value="CONSULTING">Consulting</option>
                        <option value="MANAGEMENT">Management</option>
                        <option value="FINANCE">Finance</option>
                        <option value="OPERATIONS">Operations</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                    <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_EMPLOYEE">Employee</option>
                </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                    {initialData ? "Update User" : "Create User"}
                </button>
            </div>
        </form>
    );
};

export default UserForm;