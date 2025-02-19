import api from './api';
import {
    DeviceOverviewData,
    RequestManagementData,
    WarrantyManagementData
} from '../types/dashboards';

const dashboardService = {
    getDeviceOverview: async () => {
        return api.get<DeviceOverviewData>('/devices/dashboard');
    },

    getRequestDashboard: async () => {
        return api.get<RequestManagementData>('/device-requests/dashboard');
    },

    getWarrantyDashboard: async () => {
        return api.get<WarrantyManagementData>('/warranties/dashboard');
    }
};

export default dashboardService;