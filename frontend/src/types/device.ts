export type DeviceStatus = "AVAILABLE" | "ASSIGNED" | "MAINTENANCE";
export type DeviceLocation =
    | "WAREHOUSE"
    | "OFFICE_HQ"
    | "OFFICE_BRANCH"
    | "WITH_EMPLOYEE"
    | "IN_TRANSIT";

// Assuming the User type has already been defined
export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: "ROLE_SUPER_ADMIN" | "ROLE_ADMIN" | "ROLE_EMPLOYEE";
    department: string;
    isActive: boolean;
    assigneeDevices?: DeviceDTO[];
}

// DeviceCreateDTO for creating a new device
export interface DeviceCreateDTO {
    serialNumber: string;
    manufacturer: string;
    modelName: string;
    purchaseDate: string; // ISO date string (YYYY-MM-DD)
    condition: "NEW" | "USED" | "REFURBISHED" | "DAMAGED";
    location: DeviceLocation;
}

// WarrantyCreateDTO for creating a new warranty
export interface WarrantyCreateDTO {
    warrantyId: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    type: "STANDARD" | "EXTENDED" | "PREMIUM" | "THIRD_PARTY";
    description?: string;
}

// WarrantyDTO for representing warranty details
export interface WarrantyDTO {
    id: number;
    warrantyId: string;
    startDate: string;
    endDate: string;
    type: "STANDARD" | "EXTENDED" | "PREMIUM" | "THIRD_PARTY";
    description?: string;
    status: "PENDING" | "ACTIVE" | "EXPIRED";
}

// DeviceDTO for representing device details
export interface DeviceDTO {
    id: number;
    serialNumber: string;
    manufacturer: string;
    modelName: string;
    status: DeviceStatus;
    condition: "NEW" | "USED" | "REFURBISHED" | "DAMAGED";
    location: DeviceLocation;
    purchaseDate: string;
    assignedUser?: User | null; // Properly type assignedUser
    warranties?: WarrantyDTO[];
    createTime: string;
    updateTime: string;
}

// DeviceSearchParams for device search functionality
export interface DeviceSearchParams {
    serialNumber?: string;
    status?: DeviceStatus;
    location?: DeviceLocation;
}

// Auth-related types
export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface DeviceState {
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