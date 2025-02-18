import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDevices,
  assignDeviceThunk,
  getDeviceDetails,
  deleteDeviceThunk,
} from "../../store/deviceSlice";
import { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import {
  DeviceDTO,
  DeviceStatus,
  DeviceLocation,
  DeviceSearchParams,
} from "../../types/device";
import DeviceForm from "./DeviceForm";
import {
  AlertCircle,
  RefreshCw,
  Plus,
  Edit2,
  UserPlus,
  Shield,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "../common/Alert";

const DeviceManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading, error } = useSelector(
    (state: RootState) => state.devices
  );

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = devices.pageSize || 10;
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceDTO | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignDeviceId, setAssignDeviceId] = useState<number | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceDTO | null>(null);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchParams, setSearchParams] = useState<DeviceSearchParams>({});
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceDTO | null>(null);

  useEffect(() => {
    dispatch(fetchDevices({
      page: currentPage,
      size: pageSize,
      ...searchParams
    }));
  }, [dispatch, currentPage, pageSize, searchParams]);

  const handleSearchParamsChange = (newParams: Partial<DeviceSearchParams>) => {
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

  const getStatusBadgeClass = (status: DeviceStatus) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "AVAILABLE":
        return `${baseClass} bg-green-100 text-green-800`;
      case "ASSIGNED":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "MAINTENANCE":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
    }
  };

  const getConditionBadgeClass = (condition: DeviceDTO["condition"]) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (condition) {
      case "NEW":
        return `${baseClass} bg-green-100 text-green-800`;
      case "USED":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "REFURBISHED":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "DAMAGED":
        return `${baseClass} bg-red-100 text-red-800`;
    }
  };

  const handleManageWarranty = async (device: DeviceDTO) => {
    try {
      const result = await dispatch(getDeviceDetails(device.id)).unwrap();
      setSelectedDevice(result);
      setShowWarrantyModal(true);
    } catch (error) {
      console.error("Failed to load warranties:", error);
    }
  };

  const handleAssignDevice = async () => {
    if (assignDeviceId && assignUserId) {
      try {
        setIsAssigning(true);
        await dispatch(
          assignDeviceThunk({
            deviceId: assignDeviceId,
            userId: assignUserId,
          })
        ).unwrap();
        setShowAssignModal(false);
        setAssignDeviceId(null);
        setAssignUserId(null);
      } catch (error) {
        console.error("Error assigning device:", error);
      } finally {
        setIsAssigning(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Device Management
        </h1>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => dispatch(fetchDevices({
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
              setEditingDevice(null);
              setShowDeviceModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Device
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
          value={searchParams.status || ""}
          onChange={(e) => handleSearchParamsChange({
            status: (e.target.value as DeviceStatus) || undefined
          })}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 bg-white"
          value={searchParams.location || ""}
          onChange={(e) => handleSearchParamsChange({
            location: (e.target.value as DeviceLocation) || undefined
          })}
        >
          <option value="">All Locations</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="OFFICE_HQ">Office HQ</option>
          <option value="OFFICE_BRANCH">Office Branch</option>
          <option value="WITH_EMPLOYEE">With Employee</option>
          <option value="IN_TRANSIT">In Transit</option>
        </select>
        <input
          type="text"
          placeholder="Search by Serial Number"
          className="border rounded-lg px-3 py-2 bg-white"
          value={searchParams.serialNumber || ""}
          onChange={(e) => handleSearchParamsChange({
            serialNumber: e.target.value || undefined
          })}
        />
        <button
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
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
            ) : devices.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No devices found
                </td>
              </tr>
            ) : (
              devices.content.map((device) => (
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
                    <div className="flex flex-col gap-1">
                      <span className={getStatusBadgeClass(device.status)}>
                        {device.status}
                      </span>
                      <span className={getConditionBadgeClass(device.condition)}>
                        {device.condition}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {device.location.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {device.assignedUser ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {device.assignedUser.firstName}{" "}
                          {device.assignedUser.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {device.assignedUser.email}
                        </span>
                        <span className="text-xs text-gray-400">
                          {device.assignedUser.department}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingDevice(device);
                          setShowDeviceModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit device"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setAssignDeviceId(device.id);
                          setShowAssignModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Assign device"
                        disabled={device.status === "MAINTENANCE"}
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleManageWarranty(device)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Manage warranties"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeviceToDelete(device)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete device"
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
            Showing {devices.content.length} of {devices.totalElements} devices
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: devices.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded-lg border ${currentPage === i
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= devices.totalPages - 1}
              className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Device Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingDevice ? "Edit Device" : "Add Device"}
            </h2>
            <DeviceForm
              initialData={editingDevice}
              onClose={() => setShowDeviceModal(false)}
            />
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Assign Device</h2>
            <div className="mb-4">
              <label className="block mb-2">Search Users</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-lg"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name or email"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                onClick={handleAssignDevice}
                disabled={isAssigning}
              >
                {isAssigning && <RefreshCw className="w-4 h-4 animate-spin" />}
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warranty Modal */}
      {showWarrantyModal && selectedDevice && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Warranty Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowWarrantyModal(false)}
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

            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Device: {selectedDevice.modelName} (
                {selectedDevice.serialNumber})
              </h3>
            </div>

            <div className="overflow-x-auto">
              {selectedDevice.warranties &&
                selectedDevice.warranties.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warranty ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedDevice.warranties.map((warranty) => (
                      <tr key={warranty.id}>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {warranty.warrantyId}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {warranty.type}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {warranty.startDate}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {warranty.endDate}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${warranty.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : warranty.status === "EXPIRED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {warranty.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No warranties found for this device.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
                onClick={() => setShowWarrantyModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete {deviceToDelete.modelName} (SN: {deviceToDelete.serialNumber})?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                onClick={() => setDeviceToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                onClick={async () => {
                  try {
                    await dispatch(deleteDeviceThunk(deviceToDelete.id)).unwrap();
                    setDeviceToDelete(null);
                    // Refresh the list to maintain pagination consistency
                    dispatch(fetchDevices({
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
  );
};

export default DeviceManagement;
