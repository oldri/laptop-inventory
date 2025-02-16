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
    role: "ROLE_SUPER_ADMIN" | "ROLE_ADMIN" | "ROLE_EMPLOYEE";
    department: string;
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}
