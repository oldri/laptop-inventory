import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../services/dashboard.service';
import { DashboardState } from '../types/dashboards';

export const fetchDeviceOverview = createAsyncThunk(
    'dashboard/fetchDeviceOverview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dashboardService.getDeviceOverview();
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch device overview');
        }
    }
);

export const fetchRequestDashboard = createAsyncThunk(
    'dashboard/fetchRequestDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dashboardService.getRequestDashboard();
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch request dashboard');
        }
    }
);

export const fetchWarrantyDashboard = createAsyncThunk(
    'dashboard/fetchWarrantyDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dashboardService.getWarrantyDashboard();
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch warranty dashboard');
        }
    }
);

const initialState: DashboardState = {
    deviceOverview: null,
    requestManagement: null,
    warrantyManagement: null,
    loading: {
        deviceOverview: false,
        requestManagement: false,
        warrantyManagement: false
    },
    error: {
        deviceOverview: null,
        requestManagement: null,
        warrantyManagement: null
    }
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = {
                deviceOverview: null,
                requestManagement: null,
                warrantyManagement: null
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Device Overview
            .addCase(fetchDeviceOverview.pending, (state) => {
                state.loading.deviceOverview = true;
                state.error.deviceOverview = null;
            })
            .addCase(fetchDeviceOverview.fulfilled, (state, action) => {
                state.deviceOverview = action.payload;
                state.loading.deviceOverview = false;
            })
            .addCase(fetchDeviceOverview.rejected, (state, action) => {
                state.loading.deviceOverview = false;
                state.error.deviceOverview = action.payload as string;
            })
            // Request Dashboard
            .addCase(fetchRequestDashboard.pending, (state) => {
                state.loading.requestManagement = true;
                state.error.requestManagement = null;
            })
            .addCase(fetchRequestDashboard.fulfilled, (state, action) => {
                state.requestManagement = action.payload;
                state.loading.requestManagement = false;
            })
            .addCase(fetchRequestDashboard.rejected, (state, action) => {
                state.loading.requestManagement = false;
                state.error.requestManagement = action.payload as string;
            })
            // Warranty Dashboard
            .addCase(fetchWarrantyDashboard.pending, (state) => {
                state.loading.warrantyManagement = true;
                state.error.warrantyManagement = null;
            })
            .addCase(fetchWarrantyDashboard.fulfilled, (state, action) => {
                state.warrantyManagement = action.payload;
                state.loading.warrantyManagement = false;
            })
            .addCase(fetchWarrantyDashboard.rejected, (state, action) => {
                state.loading.warrantyManagement = false;
                state.error.warrantyManagement = action.payload as string;
            });
    }
});

export const { clearErrors } = dashboardSlice.actions;
export default dashboardSlice.reducer;