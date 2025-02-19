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

    // State variables
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = requests.pageSize || 10;
    const [searchParams, setSearchParams] = useState<{
        type?: RequestType;
        status?: RequestStatus;
        priority?: RequestPriority;
    }>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<DeviceRequestDTO | null>(null);
    const [actionState, setActionState] = useState<{
        type: 'approve' | 'reject' | null;
        requestId: number | null;
        reason: string | null;
    }>({ type: null, requestId: null, reason: '' });
    const [processing, setProcessing] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<DeviceRequestDTO | null>(null);

    useEffect(() => {
        dispatch(fetchDeviceRequests({
            page: currentPage,
            size: pageSize,
            ...searchParams,
        }));
    }, [dispatch, currentPage, pageSize, searchParams]);

    // Modified filter handling
    const handleFilterChange = (newParams: Partial<{
        type?: RequestType;
        status?: RequestStatus;
        priority?: RequestPriority;
    }>) => {
        setCurrentPage(0); // Reset to first page
        setSearchParams(prev => ({
            ...prev,
            ...newParams
        }));
    };

    const handleClearFilters = () => {
        setCurrentPage(0);
        setSearchParams({});
    };

    // Displayed requests are directly from the server response, as filtering is handled server-side.
    const displayedRequests = requests.content;

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

    const handleStatusAction = async () => {
        if (actionState.type === 'reject' && !(actionState.reason ?? '').trim()) {
            return;
        }

        setProcessing(true);
        try {
            await dispatch(updateDeviceRequestStatus({
                id: actionState.requestId!,
                status: actionState.type === 'approve' ? 'APPROVED' : 'REJECTED',
                reasonForRejection: actionState.type === 'reject' ? actionState.reason : null
            })).unwrap();

            dispatch(fetchDeviceRequests({
                page: currentPage,
                size: pageSize,
                ...searchParams
            }));
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setProcessing(false);
            setActionState({ type: null, requestId: null, reason: '' });
        }
    };

    const handleDeleteRequest = async (id: number) => {
        setRequestToDelete(requests.content.find(request => request.id === id) || null);
    };

    const confirmDeleteRequest = async () => {
        if (!requestToDelete) return;

        try {
            await dispatch(deleteDeviceRequest(requestToDelete.id)).unwrap();
            setRequestToDelete(null);
            dispatch(fetchDeviceRequests({
                page: currentPage,
                size: pageSize,
                ...searchParams
            }));
        } catch (error) {
            console.error("Failed to delete request:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 rounded-xl">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Device Requests</h1>
                    <div className="flex gap-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            onClick={() =>
                                dispatch(
                                    fetchDeviceRequests({
                                        page: currentPage,
                                        size: pageSize,
                                        ...searchParams,
                                    })
                                )
                            }
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
                    <Alert variant="destructive" className="mb-6 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="!mt-0">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Filter controls */}
                <div className="mb-6 flex gap-4">
                    <select
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.type || ""}
                        onChange={(e) => handleFilterChange({
                            type: (e.target.value as RequestType) || undefined
                        })}
                    >
                        <option value="">All Types</option>
                        <option value="NEW_DEVICE">New Device</option>
                        <option value="DEVICE_ASSIGNMENT">Device Assignment</option>
                    </select>
                    <select
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.status || ""}
                        onChange={(e) => handleFilterChange({
                            status: (e.target.value as RequestStatus) || undefined
                        })}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <select
                        className="border rounded-lg px-3 py-2 bg-white"
                        value={searchParams.priority || ""}
                        onChange={(e) => handleFilterChange({
                            priority: (e.target.value as RequestPriority) || undefined
                        })}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                    <button
                        onClick={handleClearFilters}
                        disabled={loading}
                        className={`bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Device Requests Table */}
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
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                    </td>
                                </tr>
                            ) : displayedRequests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No requests found
                                    </td>
                                </tr>
                            ) : (
                                displayedRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {request.type === "NEW_DEVICE"
                                                        ? `New Device (Qty: ${request.quantity})`
                                                        : `Assign Device: ${request.device?.modelName}`}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Requested on: {request.requestedDate}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadgeClass(request.status)}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getPriorityBadgeClass(request.priority)}>
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
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View details"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                {request.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => setActionState({
                                                                type: 'approve',
                                                                requestId: request.id,
                                                                reason: ''
                                                            })}
                                                            className="text-green-600 hover:text-green-800"
                                                            disabled={processing}
                                                        >
                                                            {processing && actionState.type === 'approve' ? (
                                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <Check className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setActionState({
                                                                type: 'reject',
                                                                requestId: request.id,
                                                                reason: ''
                                                            })}
                                                            className="text-red-600 hover:text-red-800"
                                                            disabled={processing}
                                                        >
                                                            {processing && actionState.type === 'reject' ? (
                                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <X className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteRequest(request.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete request"
                                                    disabled={processing}
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
                            Showing {displayedRequests.length} of {requests.totalElements} requests
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: requests.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Go to page ${i + 1}`}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-3 py-1 rounded-lg border ${currentPage === i ? "bg-blue-500 text-white" : "hover:bg-gray-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage >= requests.totalPages - 1}
                                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Updated Action Modal */}
                {actionState.type && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {actionState.type === 'approve' ? 'Confirm Approval' : 'Reject Request'}
                                </h2>

                                <button
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setActionState({ type: null, requestId: null, reason: '' })}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {actionState.type === 'reject' && (
                                <div className="space-y-4">
                                    {(!actionState.reason || !actionState.reason.trim()) && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Alert variant="destructive" className="flex items-center gap-2 flex-1">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="pt-0 !mt-0">Rejection reason is required</AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                    <textarea
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                        value={actionState.reason ?? ''}
                                        onChange={(e) => setActionState(prev => ({
                                            ...prev,
                                            reason: e.target.value
                                        }))}
                                        placeholder="Enter reason for rejection..."
                                        rows={4}
                                    />

                                </div>
                            )}

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
                                    onClick={() => setActionState({ type: null, requestId: null, reason: '' })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${actionState.type === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : `bg-red-600 ${!(actionState.reason ?? '').trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`
                                        }`}
                                    onClick={handleStatusAction}
                                    disabled={actionState.type === 'reject' && !(actionState.reason ?? '').trim()}
                                >
                                    {processing ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        actionState.type === 'approve' ? 'Approve' : 'Reject'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {requestToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2">
                            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete the following device request?
                            </p>
                            <div className="mb-4 overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50">
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {requestToDelete.type === "NEW_DEVICE"
                                                            ? `New Device (Qty: ${requestToDelete.quantity})`
                                                            : `Assign Device: ${requestToDelete.device?.modelName}`}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Requested on: {requestToDelete.requestedDate}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getStatusBadgeClass(requestToDelete.status)}>
                                                    {requestToDelete.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getPriorityBadgeClass(requestToDelete.priority)}>
                                                    {requestToDelete.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {requestToDelete.requester.firstName} {requestToDelete.requester.lastName}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {requestToDelete.requester.email}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                                    onClick={() => setRequestToDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                                    onClick={confirmDeleteRequest}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Request Modal */}
                {showCreateModal && (
                    <CreateDeviceRequest onClose={() => setShowCreateModal(false)} />
                )}
                {/* Request Details Modal */}
                {selectedRequest && (
                    <DeviceRequestDetails
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default DeviceRequestList;
