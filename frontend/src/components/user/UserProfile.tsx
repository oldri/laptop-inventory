import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../store/userSlice";
import { AppDispatch, RootState } from "../../store";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../common/Alert";
import DeviceTable from "../device/DeviceTable";

const UserProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { loading, error } = useSelector((state: RootState) => state.users);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="m-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Name:</p>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Username:</p>
                        <p className="font-medium">@{user?.username}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Role:</p>
                        <p className="font-medium">{user?.role.replace("ROLE_", "")}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Department:</p>
                        <p className="font-medium">{user?.department}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Status:</p>
                        <span className={`px-3 py-1 rounded-full text-sm ${user?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}>
                            {user?.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Assigned Devices</h2>
                <DeviceTable
                    devices={user?.assignedDevices || []}
                    loading={false}
                    currentPage={0}
                    pageSize={10}
                    totalElements={user?.assignedDevices?.length || 0}
                    showActions={false}
                />
            </div>
        </div>
    );
};

export default UserProfile;