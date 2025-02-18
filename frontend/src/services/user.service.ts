import api from "./api";
import { Page, UserCreateDTO, UserDTO, UserSearchParams, UserUpdateDTO } from "../types/user";

export type UserPaginationParams = {
    page?: number;
    size?: number;
} & UserSearchParams;

export const userService = {
    getUsers: async (params: UserPaginationParams = {}) => {
        if (params.role || params.department || params.search) {
            return userService.searchUsers(params, params.page, params.size);
        }
        return api.get<Page<UserDTO>>("/users", { params });
    },

    createUser: async (data: UserCreateDTO) => {
        return api.post<UserDTO>("/users", data);
    },

    updateUser: async (id: number, data: UserUpdateDTO) => {
        return api.put<UserDTO>(`/users/${id}`, data);
    },

    deleteUser: async (id: number) => {
        return api.delete(`/users/${id}`);
    },

    getUserById: async (id: number) => {
        return api.get<UserDTO>(`/users/${id}`);
    },

    getProfile: async () => {
        return api.get<UserDTO>("/users/profile");
    },

    searchUsers: async (
        params: UserSearchParams,
        page: number = 0,
        size: number = 10
    ) => {
        return api.get<Page<UserDTO>>("/users/search", {
            params: {
                role: params.role,
                department: params.department,
                search: params.search,
                page,
                size
            }
        });
    }
};

export default userService;