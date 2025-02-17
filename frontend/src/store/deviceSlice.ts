import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    DeviceDTO,
    DeviceCreateDTO,
    WarrantyDTO,
    WarrantyCreateDTO,
} from "../types/device";
import deviceService, { PaginationParams } from "../services/device.service";

const calculateWarrantyStatus = (
    start: string,
    end: string
): "PENDING" | "ACTIVE" | "EXPIRED" => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return "PENDING";
    if (now > endDate) return "EXPIRED";
    return "ACTIVE";
};

const convertWarranty = (warranty: any): WarrantyDTO => ({
    ...warranty,
    status: calculateWarrantyStatus(warranty.startDate, warranty.endDate),
});

// In deviceSlice.ts
export const fetchDevices = createAsyncThunk(
    "devices/fetchDevices",
    async (params: PaginationParams = {}, { rejectWithValue }) => {
        try {
            // If any filtering parameter is present, use the search endpoint.
            const hasFilters =
                !!params.status || !!params.location || !!params.serialNumber;
            const response = hasFilters
                ? await deviceService.searchDevices(
                    {
                        status: params.status,
                        location: params.location,
                        serialNumber: params.serialNumber,
                    },
                    params.page ?? 0,
                    params.size ?? 10
                )
                : await deviceService.getDevices({ page: params.page, size: params.size });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch devices"
            );
        }
    }
);

export const createDevice = createAsyncThunk(
    "devices/createDevice",
    async (deviceData: DeviceCreateDTO, { rejectWithValue }) => {
        try {
            const response = await deviceService.createDevice(deviceData);
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to create device"
            );
        }
    }
);

export const updateDeviceThunk = createAsyncThunk(
    "devices/updateDevice",
    async (
        { id, data }: { id: number; data: Partial<DeviceCreateDTO> },
        { rejectWithValue }
    ) => {
        try {
            const response = await deviceService.updateDevice(id, data);
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update device"
            );
        }
    }
);

export const assignDeviceThunk = createAsyncThunk(
    "devices/assignDevice",
    async (
        { deviceId, userId }: { deviceId: number; userId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await deviceService.assignDevice(deviceId, userId);
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to assign device"
            );
        }
    }
);

export const createWarranty = createAsyncThunk(
    "devices/createWarranty",
    async (
        { deviceId, data }: { deviceId: number; data: WarrantyCreateDTO },
        { rejectWithValue }
    ) => {
        try {
            const response = await deviceService.createWarranty(deviceId, data);
            return { deviceId, warranty: response.data }; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to create warranty"
            );
        }
    }
);

export const updateWarranty = createAsyncThunk(
    "devices/updateWarranty",
    async (
        {
            deviceId,
            warrantyId,
            data,
        }: { deviceId: number; warrantyId: number; data: WarrantyCreateDTO },
        { rejectWithValue }
    ) => {
        try {
            const response = await deviceService.updateWarranty(
                deviceId,
                warrantyId,
                data
            );
            return { deviceId, warranty: response.data }; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update warranty"
            );
        }
    }
);

export const getDeviceDetails = createAsyncThunk(
    "devices/getDetails",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await deviceService.getDeviceDetails(id);
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to load device"
            );
        }
    }
);

interface DeviceState {
    devices: {
        content: DeviceDTO[];
        totalPages: number;
        totalElements: number;
        pageNumber: number;
        pageSize: number;
    };
    loading: boolean;
    error: string | null;
}

const initialState: DeviceState = {
    devices: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageNumber: 0,
        pageSize: 10,
    },
    loading: false,
    error: null,
};

const deviceSlice = createSlice({
    name: "devices",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch devices
            .addCase(fetchDevices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDevices.fulfilled, (state, action) => {
                state.devices = action.payload;
                state.loading = false;
            })
            .addCase(fetchDevices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create device
            .addCase(createDevice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDevice.fulfilled, (state, action) => {
                state.devices.content.push(action.payload);
                state.loading = false;
            })
            .addCase(createDevice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update device
            .addCase(updateDeviceThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeviceThunk.fulfilled, (state, action) => {
                const index = state.devices.content.findIndex(
                    (device) => device.id === action.payload.id
                );
                if (index !== -1) {
                    state.devices.content[index] = action.payload; // Update the device in the content array
                }
                state.loading = false;
            })
            .addCase(updateDeviceThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Assign device
            .addCase(assignDeviceThunk.fulfilled, (state, action) => {
                const index = state.devices.content.findIndex(
                    (device) => device.id === action.payload.id
                );
                if (index !== -1) {
                    state.devices.content[index] = action.payload; // Update the device in the content array
                }
            })
            // Create warranty
            .addCase(createWarranty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWarranty.fulfilled, (state, action) => {
                const device = state.devices.content.find(
                    (d) => d.id === action.payload.deviceId
                );
                if (device) {
                    if (!device.warranties) device.warranties = [];
                    device.warranties.push(
                        convertWarranty(action.payload.warranty)
                    );
                }
                state.loading = false;
            })
            .addCase(createWarranty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update warranty
            .addCase(updateWarranty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWarranty.fulfilled, (state, action) => {
                const device = state.devices.content.find(
                    (d) => d.id === action.payload.deviceId
                );
                if (device && device.warranties) {
                    const warrantyIndex = device.warranties.findIndex(
                        (w) => w.id === action.payload.warranty.id
                    );
                    if (warrantyIndex !== -1) {
                        device.warranties[warrantyIndex] = convertWarranty(
                            action.payload.warranty
                        );
                    }
                }
                state.loading = false;
            })
            .addCase(updateWarranty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get device details
            .addCase(getDeviceDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDeviceDetails.fulfilled, (state, action) => {
                const device = action.payload;
                if (state.devices && state.devices.content) {
                    const index = state.devices.content.findIndex(
                        (d) => d.id === device.id
                    );
                    if (index !== -1) {
                        state.devices.content[index] = device; // Update the existing device
                    } else {
                        state.devices.content.push(device); // Add the new device
                    }
                }
                state.loading = false;
            })
            .addCase(getDeviceDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = deviceSlice.actions;
export default deviceSlice.reducer;
