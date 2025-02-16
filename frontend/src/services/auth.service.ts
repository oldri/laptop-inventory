import api from "./api";
import { AuthRequest, AuthResponse, User } from "../types/auth";

const authService = {
    login: async (credentials: AuthRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            "/auth/login",
            credentials
        );

        // Save user and token to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        return response.data;
    },

    getToken: (): string | null => {
        return localStorage.getItem("token");
    },

    getUser: (): User | null => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    logout: (): void => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },
};

export default authService;
