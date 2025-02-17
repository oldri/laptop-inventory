import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    DeviceRequestDTO,
    DeviceRequestCreateDTO,
    RequestStatus,
    RequestType,
    RequestPriority,
} from "../types/deviceRequest";
import deviceRequestService from "../services/deviceRequest.service";

// Async Thunks
export const fetchDeviceRequests = createAsyncThunk(
    "deviceRequests/fetchDeviceRequests",
    async (
        params: {
            page?: number;
            size?: number;
            type?: RequestType;
            status?: RequestStatus;
            priority?: RequestPriority;
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await deviceRequestService.getDeviceRequests(params);
            return {
                ...response.data,
                filters: {
                    type: params.type,
                    status: params.status,
                    priority: params.priority,
                },
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch device requests"
            );
        }
    }
);

export const createDeviceRequest = createAsyncThunk(
    "deviceRequests/createDeviceRequest",
    async (data: DeviceRequestCreateDTO, { rejectWithValue }) => {
        try {
            const response = await deviceRequestService.createDeviceRequest(
                data
            );
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to create device request"
            );
        }
    }
);

export const updateDeviceRequestStatus = createAsyncThunk(
    "deviceRequests/updateDeviceRequestStatus",
    async (
        {
            id,
            status,
            reasonForRejection,
        }: { id: number; status: RequestStatus; reasonForRejection?: string },
        { rejectWithValue }
    ) => {
        try {
            const response =
                await deviceRequestService.updateDeviceRequestStatus(
                    id,
                    status,
                    reasonForRejection
                );
            return response.data; // Return only the data
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update device request status"
            );
        }
    }
);

export const deleteDeviceRequest = createAsyncThunk(
    "deviceRequests/deleteDeviceRequest",
    async (id: number, { rejectWithValue }) => {
        try {
            await deviceRequestService.deleteDeviceRequest(id);
            return id; // Return the ID of the deleted request
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to delete device request"
            );
        }
    }
);

interface DeviceRequestState {
    requests: {
        content: DeviceRequestDTO[];
        totalPages: number;
        totalElements: number;
        pageNumber: number;
        pageSize: number;
    };
    filters: {
        type?: RequestType;
        status?: RequestStatus;
        priority?: RequestPriority;
    };
    loading: boolean;
    error: string | null;
    lastPage: number;
}

const initialState: DeviceRequestState = {
    requests: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageNumber: 0,
        pageSize: 10,
    },
    filters: {},
    loading: false,
    error: null,
    lastPage: 0,
};

// Slice
const deviceRequestSlice = createSlice({
    name: "deviceRequests",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch device requests
            .addCase(fetchDeviceRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeviceRequests.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.filters = action.payload.filters;
                state.lastPage = action.payload.pageNumber;
                state.loading = false;
            })
            .addCase(fetchDeviceRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create device request
            .addCase(createDeviceRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDeviceRequest.fulfilled, (state, action) => {
                state.requests.content.push(action.payload);
                state.loading = false;
            })
            .addCase(createDeviceRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update device request status
            .addCase(updateDeviceRequestStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeviceRequestStatus.fulfilled, (state, action) => {
                const index = state.requests.content.findIndex(
                    (request) => request.id === action.payload.id
                );
                if (index !== -1) {
                    state.requests.content[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateDeviceRequestStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete device request
            .addCase(deleteDeviceRequest.fulfilled, (state, action) => {
                state.requests.content = state.requests.content.filter(
                    (request) => request.id !== action.payload
                );
            });
    },
});

export const { clearError } = deviceRequestSlice.actions;
export default deviceRequestSlice.reducer;
