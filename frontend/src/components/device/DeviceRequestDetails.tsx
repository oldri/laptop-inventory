import { DeviceRequestDTO, RequestStatus } from "../../types/deviceRequest";

const DeviceRequestDetails = ({
    request,
    onClose,
}: {
    request: DeviceRequestDTO;
    onClose: () => void;
}) => {
    const getStatusBadgeClass = (status: RequestStatus) => {
        const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case "PENDING": return `${baseClass} bg-yellow-100 text-yellow-800`;
            case "APPROVED": return `${baseClass} bg-green-100 text-green-800`;
            case "REJECTED": return `${baseClass} bg-red-100 text-red-800`;
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Device Request Details</h2>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
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
                        <p className="mt-2">
                            <span className={getStatusBadgeClass(request.status)}>
                                {request.status}
                            </span>
                        </p>
                    </div>
                    {request.status === "REJECTED" && (
                        <div>
                            <label className="block text-base font-semibold text-gray-700">
                                Reason for Rejection
                            </label>
                            <p className="mt-2 text-gray-900 whitespace-pre-wrap">
                                {request.reasonForRejection || "No reason provided."}
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceRequestDetails;