import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDeviceRequests,
    updateDeviceRequestStatus,
    deleteDeviceRequest,
} from "../../store/deviceRequestSlice";
import { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import {
    DeviceRequestDTO,
    RequestStatus,
    RequestType,
    RequestPriority,
} from "../../types/deviceRequest";
import {
    AlertCircle,
    RefreshCw,
    Plus,
    Edit2,
    Check,
    X,
    Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "../common/Alert";
import CreateDeviceRequest from "./CreateDeviceRequest";
import DeviceRequestDetails from "./DeviceRequestDetails";

const DeviceRequestList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { requests, loading, error } = useSelector(
        (state: RootState) => state.deviceRequests
    );

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] =
        useState<DeviceRequestDTO | null>(null);
    const [searchParams, setSearchParams] = useState<{
        type?: RequestType;
        status?: RequestStatus;
        priority?: RequestPriority;
    }>({});

    useEffect(() => {
        dispatch(fetchDeviceRequests());
    }, [dispatch]);

    const filteredRequests = requests.content.filter((request) => {
        const matchesType =
            !searchParams.type || request.type === searchParams.type;
        const matchesStatus =
            !searchParams.status || request.status === searchParams.status;
        const matchesPriority =
            !searchParams.priority ||
            request.priority === searchParams.priority;
        return matchesType && matchesStatus && matchesPriority;
    });

    const getStatusBadgeClass = (status: RequestStatus) => {
        const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case "PENDING":
                return `${baseClass} bg-yellow-100 text-yellow-800`;
            case "APPROVED":
                return `${baseClass} bg-green-100 text-green-800`;
            case "REJECTED":
                return `${baseClass} bg-red-100 text-red-800`;
        }
    };

    const getPriorityBadgeClass = (priority: RequestPriority) => {
        const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
        switch (priority) {
            case "LOW":
                return `${baseClass} bg-gray-100 text-gray-800`;
            case "MEDIUM":
                return `${baseClass} bg-blue-100 text-blue-800`;
            case "HIGH":
                return `${baseClass} bg-yellow-100 text-yellow-800`;
            case "URGENT":
                return `${baseClass} bg-red-100 text-red-800`;
        }
    };

    const handleUpdateStatus = async (
        id: number,
        status: RequestStatus,
        reason?: string
    ) => {
        try {
            await dispatch(
                updateDeviceRequestStatus({
                    id,
                    status,
                    reasonForRejection: reason,
                })
            ).unwrap();
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    };

    const handleDeleteRequest = async (id: number) => {
        try {
            await dispatch(deleteDeviceRequest(id)).unwrap();
        } catch (error) {
            console.error("Failed to delete request:", error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Device Requests
                </h1>
                <div className="flex gap-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => dispatch(fetchDeviceRequests())}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Create Request
                    </button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="mb-6 flex gap-4">
                <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={searchParams.type || ""}
                    onChange={(e) =>
                        setSearchParams((prev) => ({
                            ...prev,
                            type: (e.target.value as RequestType) || undefined,
                        }))
                    }
                >
                    <option value="">All Types</option>
                    <option value="NEW_DEVICE">New Device</option>
                    <option value="DEVICE_ASSIGNMENT">Device Assignment</option>
                </select>
                <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={searchParams.status || ""}
                    onChange={(e) =>
                        setSearchParams((prev) => ({
                            ...prev,
                            status:
                                (e.target.value as RequestStatus) || undefined,
                        }))
                    }
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={searchParams.priority || ""}
                    onChange={(e) =>
                        setSearchParams((prev) => ({
                            ...prev,
                            priority:
                                (e.target.value as RequestPriority) ||
                                undefined,
                        }))
                    }
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    onClick={() => setSearchParams({})}
                >
                    Clear Filters
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Requester
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-4 text-center"
                                >
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                </td>
                            </tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    No requests found
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {request.type === "NEW_DEVICE"
                                                    ? `New Device (Qty: ${request.quantity})`
                                                    : `Assign Device: ${request.device?.modelName}`}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Requested on:{" "}
                                                {request.requestedDate}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={getStatusBadgeClass(
                                                request.status
                                            )}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={getPriorityBadgeClass(
                                                request.priority
                                            )}
                                        >
                                            {request.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {request.requester.firstName}{" "}
                                                {request.requester.lastName}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {request.requester.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setSelectedRequest(request)
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                                title="View details"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            {request.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                request.id,
                                                                "APPROVED"
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Approve request"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                request.id,
                                                                "REJECTED",
                                                                "Reason for rejection"
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Reject request"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDeleteRequest(
                                                        request.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete request"
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
            </div>

            {/* Create Request Modal */}
            {showCreateModal && (
                <CreateDeviceRequest
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Request Details Modal */}
            {selectedRequest && (
                <DeviceRequestDetails
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    );
};

export default DeviceRequestList;
