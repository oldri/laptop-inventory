import api from "./api";
import {
    DeviceDTO,
    DeviceCreateDTO,
    WarrantyDTO,
    WarrantyCreateDTO,
    DeviceSearchParams,
} from "../types/device";

// Define the structure of a paginated response
interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

const deviceService = {
    getDevices: async (page: number = 0, size: number = 10) => {
        // GET /devices – retrieve the list of devices with pagination
        return api.get<Page<DeviceDTO>>("/devices", {
            params: { page, size },
        });
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
        // GET /devices/search – search devices with pagination
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
