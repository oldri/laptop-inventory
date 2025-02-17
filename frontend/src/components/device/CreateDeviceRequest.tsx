import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeviceRequest } from "../../store/deviceRequestSlice";
import { fetchDevices } from "../../store/deviceSlice"; // Import fetchDevices action
import {
    DeviceRequestCreateDTO,
    RequestType,
    RequestPriority,
} from "../../types/deviceRequest";
import { Alert, AlertDescription } from "../common/Alert";
import { AppDispatch, RootState } from "../../store";
import { RefreshCw, AlertCircle } from "lucide-react";

const CreateDeviceRequest = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { devices, loading, error } = useSelector(
        (state: RootState) => state.devices
    );

    const [formData, setFormData] = useState<DeviceRequestCreateDTO>({
        type: "NEW_DEVICE",
        deviceId: undefined,
        quantity: 1,
        requestedDate: new Date().toISOString().split("T")[0],
        priority: "MEDIUM",
        notes: "",
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchDevices());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createDeviceRequest(formData)).unwrap();
            onClose();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create request"
            );
        }
    };

    const availableDevices = devices?.content?.filter(
        (device) => device.status === "AVAILABLE"
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-11/12 md:w-1/2">
                <h2 className="text-xl font-bold mb-4">
                    Create Device Request
                </h2>
                {loading && (
                    <div className="mb-4 text-center">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    </div>
                )}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {errorMessage && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Request Type</label>
                        <select
                            className="w-full border px-3 py-2 rounded-lg"
                            value={formData.type}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    type: e.target.value as RequestType,
                                }))
                            }
                        >
                            <option value="NEW_DEVICE">New Device</option>
                            <option value="DEVICE_ASSIGNMENT">
                                Device Assignment
                            </option>
                        </select>
                    </div>
                    {formData.type === "DEVICE_ASSIGNMENT" && (
                        <div className="mb-4">
                            <label className="block mb-2">Device</label>
                            <select
                                className="w-full border px-3 py-2 rounded-lg"
                                value={formData.deviceId || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        deviceId: parseInt(e.target.value),
                                    }))
                                }
                                required
                            >
                                <option value="">Select a device</option>
                                {availableDevices?.map((device) => (
                                    <option key={device.id} value={device.id}>
                                        {device.modelName} (Serial:{" "}
                                        {device.serialNumber})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {formData.type === "NEW_DEVICE" && (
                        <div className="mb-4">
                            <label className="block mb-2">Quantity</label>
                            <input
                                type="number"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        quantity: parseInt(e.target.value),
                                    }))
                                }
                                min={1}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block mb-2">Requested Date</label>
                        <input
                            type="date"
                            className="w-full border px-3 py-2 rounded-lg"
                            value={formData.requestedDate}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    requestedDate: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Priority</label>
                        <select
                            className="w-full border px-3 py-2 rounded-lg"
                            value={formData.priority}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    priority: e.target.value as RequestPriority,
                                }))
                            }
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Notes</label>
                        <textarea
                            className="w-full border px-3 py-2 rounded-lg"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    notes: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDeviceRequest;
