import api from "./api";
import { AuthRequest, AuthResponse } from "../types/auth";

export const authService = {
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(
            "/api/auth/login",
            credentials
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        return response.data;
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    getUser(): any {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    logout(): void {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },
};
