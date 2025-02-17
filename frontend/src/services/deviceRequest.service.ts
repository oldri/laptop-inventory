import api from "./api";
import {
    DeviceRequestDTO,
    DeviceRequestCreateDTO,
} from "../types/deviceRequest";
import { Page } from "../types/device";
import { RequestStatus } from "../types/deviceRequest";

const deviceRequestService = {
    getDeviceRequestById: async (id: number) => {
        return api.get<DeviceRequestDTO>(`/device-requests/${id}`);
    },
    
    getDeviceRequests: async (page: number = 0, size: number = 10) => {
        // GET /device-requests – retrieve the list of device requests with pagination
        return api.get<Page<DeviceRequestDTO>>("/device-requests", {
            params: { page, size },
        });
    },

    createDeviceRequest: async (data: DeviceRequestCreateDTO) => {
        // POST /device-requests – create a new device request
        return api.post<DeviceRequestDTO>("/device-requests", data);
    },

    updateDeviceRequestStatus: async (
        id: number,
        status: RequestStatus,
        reasonForRejection?: string
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
