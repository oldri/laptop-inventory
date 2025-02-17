import { User } from "./auth";
import { DeviceDTO } from "./device";

export type RequestType = "NEW_DEVICE" | "DEVICE_ASSIGNMENT";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// DeviceRequestCreateDTO for creating a new device request
export interface DeviceRequestCreateDTO {
    type: RequestType;
    deviceId?: number; // Required for DEVICE_ASSIGNMENT
    quantity?: number; // Required for NEW_DEVICE
    requestedDate: string; // ISO date string (YYYY-MM-DD)
    priority: RequestPriority;
    notes?: string;
}

export interface DeviceRequestDTO {
    id: number;
    requester: User;
    processedBy?: User;
    type: RequestType;
    status: RequestStatus;
    priority: RequestPriority;
    device?: DeviceDTO;
    quantity?: number;
    notes?: string;
    reasonForRejection?: string;
    requestedDate: string;
    createTime: string; // Ensure this is included
    updateTime: string; // Ensure this is included
}
