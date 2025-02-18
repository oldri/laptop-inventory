import { DeviceDTO, DeviceStatus } from "../../types/device";
import { RefreshCw, Edit2, Trash2 } from "lucide-react";

interface DeviceTableProps {
    devices: DeviceDTO[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    totalElements: number;
    onPageChange?: (page: number) => void;
    onEditDevice?: (device: DeviceDTO) => void;
    onDeleteDevice?: (device: DeviceDTO) => void;
    showActions?: boolean;
}

const getStatusBadgeClass = (status: DeviceStatus) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
        case "AVAILABLE": return `${baseClass} bg-green-100 text-green-800`;
        case "ASSIGNED": return `${baseClass} bg-blue-100 text-blue-800`;
        case "MAINTENANCE": return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
};

const DeviceTable = ({
    devices,
    loading,
    currentPage,
    pageSize,
    totalElements,
    onPageChange,
    onEditDevice,
    onDeleteDevice,
    showActions = true
}: DeviceTableProps) => {
    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Device Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        {showActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center">
                                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                            </td>
                        </tr>
                    ) : devices.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                No devices found
                            </td>
                        </tr>
                    ) : (
                        devices.map((device) => (
                            <tr key={device.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {device.modelName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {device.manufacturer}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            SN: {device.serialNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={getStatusBadgeClass(device.status)}>
                                        {device.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-900">
                                        {device.location.replace("_", " ")}
                                    </span>
                                </td>
                                {showActions && onEditDevice && onDeleteDevice && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditDevice(device)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit device"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteDevice(device)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete device"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {onPageChange && (
                <div className="mt-4 flex items-center justify-between px-6 py-3 bg-white border-t">
                    <div className="text-sm text-gray-500">
                        Showing {devices.length} of {totalElements} devices
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
            )}
        </div>
    );
};

export default DeviceTable;