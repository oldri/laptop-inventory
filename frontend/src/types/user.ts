import { DeviceDTO } from "./device";

export type UserRole = "ROLE_SUPER_ADMIN" | "ROLE_ADMIN" | "ROLE_EMPLOYEE";
export type Department =
    "HR" | "TECH" | "CONSULTING" | "MANAGEMENT" | "FINANCE" | "OPERATIONS";

export interface UserCreateDTO {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    department: Department;
}

export interface UserUpdateDTO {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: UserRole;
    department?: Department;
    isActive?: boolean;
}

export interface UserDTO {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    department: Department;
    isActive: boolean;
    assignedDevices: DeviceDTO[];
    createTime: string;
    updateTime: string;
}

export interface UserSearchParams {
    role?: UserRole;
    department?: Department;
    search?: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

export interface UserState {
    users: Page<UserDTO>;
    loading: boolean;
    error: string | null;
    filters: UserSearchParams;
}