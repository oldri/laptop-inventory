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
    role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE";
    department: string;
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}
