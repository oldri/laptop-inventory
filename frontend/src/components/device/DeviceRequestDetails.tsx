import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    updateDeviceRequestStatus,
    deleteDeviceRequest,
} from "../../store/deviceRequestSlice";
import { DeviceRequestDTO, RequestStatus } from "../../types/deviceRequest";
import { Alert, AlertDescription } from "../common/Alert";
import { Check, X, Trash2 } from "lucide-react";
import { AppDispatch } from "../../store";

const DeviceRequestDetails = ({
    request,
    onClose,
}: {
    request: DeviceRequestDTO;
    onClose: () => void;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [status, setStatus] = useState<RequestStatus>(request.status);
    const [reason, setReason] = useState<string>(
        request.reasonForRejection || ""
    );
    const [error, setError] = useState<string | null>(null);

    const handleUpdateStatus = async () => {
        try {
            await dispatch(
                updateDeviceRequestStatus({
                    id: request.id,
                    status,
                    reasonForRejection: reason,
                })
            ).unwrap();
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update status"
            );
        }
    };

    const handleDeleteRequest = async () => {
        try {
            await dispatch(deleteDeviceRequest(request.id)).unwrap();
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete request"
            );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Device Request Details
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Request Type
                        </label>
                        <p className="mt-2 text-gray-900">
                            {request.type === "NEW_DEVICE"
                                ? `New Device (Qty: ${request.quantity})`
                                : `Assign Device: ${request.device?.modelName}`}
                        </p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Requester
                        </label>
                        <p className="mt-2 text-gray-900">
                            {request.requester.firstName}{" "}
                            {request.requester.lastName}
                        </p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Requested Date
                        </label>
                        <p className="mt-2 text-gray-900">
                            {request.requestedDate}
                        </p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Priority
                        </label>
                        <p className="mt-2 text-gray-900">{request.priority}</p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Notes
                        </label>
                        <p className="mt-2 text-gray-900">
                            {request.notes || "No notes provided."}
                        </p>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700">
                            Status
                        </label>
                        <select
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-2"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as RequestStatus)
                            }
                            disabled={request.status !== "PENDING"}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    {status === "REJECTED" && (
                        <div>
                            <label className="block text-base font-semibold text-gray-700">
                                Reason for Rejection
                            </label>
                            <textarea
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-2"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Provide a reason for rejection"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    {request.status === "PENDING" && (
                        <>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                                onClick={handleUpdateStatus}
                            >
                                <Check className="w-4 h-4" />
                                Update Status
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    setStatus("REJECTED");
                                    setReason("");
                                }}
                            >
                                <X className="w-4 h-4" />
                                Reject
                            </button>
                        </>
                    )}
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                        onClick={handleDeleteRequest}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceRequestDetails;
