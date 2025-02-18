import { DeviceDTO } from "./device";
import { UserRole } from "./user";

export interface AuthRequest {
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    department: string;
    isActive: boolean;
    assignedDevices: DeviceDTO[];
}

export interface AuthResponse {
    token: string;
    user: User;
}