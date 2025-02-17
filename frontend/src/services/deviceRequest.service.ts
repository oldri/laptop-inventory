import api from "./api";
import {
    DeviceRequestDTO,
    DeviceRequestCreateDTO,
    RequestType,
    RequestStatus,
    RequestPriority,
} from "../types/deviceRequest";
import { Page } from "../types/device";

export type DeviceRequestPaginationParams = {
    page?: number;
    size?: number;
    type?: RequestType;
    status?: RequestStatus;
    priority?: RequestPriority;
};

const deviceRequestService = {
    getDeviceRequestById: async (id: number) => {
        return api.get<DeviceRequestDTO>(`/device-requests/${id}`);
    },

    getDeviceRequests: async (params: DeviceRequestPaginationParams = {}) => {
        // GET /device-requests – retrieve the list of device requests with pagination and filtering
        return api.get<Page<DeviceRequestDTO>>("/device-requests", {
            params
        });
    },

    createDeviceRequest: async (data: DeviceRequestCreateDTO) => {
        // POST /device-requests – create a new device request
        return api.post<DeviceRequestDTO>("/device-requests", data);
    },

    updateDeviceRequestStatus: async (
        id: number,
        status: RequestStatus,
        reasonForRejection?: string | null
    ) => {
        // PUT /device-requests/:id/status – update the status of a device request
        return api.put<DeviceRequestDTO>(`/device-requests/${id}/status`, {
            status,
            reasonForRejection,
        });
    },

    deleteDeviceRequest: async (id: number) => {
        // DELETE /device-requests/:id – delete a device request
        return api.delete(`/device-requests/${id}`);
    },
};

export default deviceRequestService;
