import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import { authService } from "../../services/auth.service";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: authService.getUser(),
    token: authService.getToken(),
    isAuthenticated: authService.getToken() !== null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
    authSlice.actions;
export default authSlice.reducer;
