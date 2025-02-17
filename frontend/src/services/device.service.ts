import api from "./api";
import {
    DeviceDTO,
    DeviceCreateDTO,
    WarrantyDTO,
    WarrantyCreateDTO,
    DeviceSearchParams,
    Page,
    DeviceLocation,
    DeviceStatus,
} from "../types/device";

export type PaginationParams = {
    page?: number;
    size?: number;
    status?: DeviceStatus;
    location?: DeviceLocation;
    serialNumber?: string;
};


export const deviceService = {
    getDevices: async (params: PaginationParams = {}) => {
        if (params.status || params.location || params.serialNumber) {
            return deviceService.searchDevices(params, params.page, params.size);
        }
        return api.get<Page<DeviceDTO>>("/devices", { params });
    },

    createDevice: async (data: DeviceCreateDTO) => {
        // POST /devices – create a new device
        return api.post<DeviceDTO>("/devices", data);
    },

    updateDevice: async (id: number, data: Partial<DeviceCreateDTO>) => {
        // PUT /devices/:id – update a device
        return api.put<DeviceDTO>(`/devices/${id}`, data);
    },

    assignDevice: async (deviceId: number, userId: number) => {
        // POST /devices/:id/assign – assign a device to a user
        return api.post<DeviceDTO>(`/devices/${deviceId}/assign`, {
            userId,
        });
    },

    getDeviceDetails: async (id: number) => {
        // GET /devices/:id – retrieve details of a specific device
        return api.get<DeviceDTO>(`/devices/${id}`);
    },

    searchDevices: async (
        params: DeviceSearchParams,
        page: number = 0,
        size: number = 10
    ) => {
        return api.get<Page<DeviceDTO>>("/devices/search", {
            params: { ...params, page, size },
        });
    },

    deleteDevice: async (id: number) => {
        // DELETE /devices/:id – delete a device
        return api.delete(`/devices/${id}`);
    },

    // Warranty endpoints (for a given device)
    getWarranties: async (deviceId: number) => {
        // GET /devices/:deviceId/warranties – retrieve warranties for a device
        return api.get<WarrantyDTO[]>(`/devices/${deviceId}/warranties`);
    },

    createWarranty: async (deviceId: number, data: WarrantyCreateDTO) => {
        // POST /devices/:deviceId/warranties – create a new warranty for a device
        return api.post<WarrantyDTO>(`/devices/${deviceId}/warranties`, data);
    },

    updateWarranty: async (
        deviceId: number,
        warrantyId: number,
        data: Partial<WarrantyCreateDTO>
    ) => {
        // PUT /devices/:deviceId/warranties/:warrantyId – update a warranty
        return api.put<WarrantyDTO>(
            `/devices/${deviceId}/warranties/${warrantyId}`,
            data
        );
    },

    deleteWarranty: async (deviceId: number, warrantyId: number) => {
        // DELETE /devices/:deviceId/warranties/:warrantyId – delete a warranty
        return api.delete(`/devices/${deviceId}/warranties/${warrantyId}`);
    },
};

export default deviceService;
