import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserCreateDTO, UserState, UserUpdateDTO } from "../types/user";
import userService, { UserPaginationParams } from "../services/user.service";

// Thunks
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (params: UserPaginationParams = {}, { rejectWithValue }) => {
        try {
            const response = await userService.getUsers(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch users"
            );
        }
    }
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData: UserCreateDTO, { rejectWithValue }) => {
        try {
            const response = await userService.createUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to create user"
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (
        { id, data }: { id: number; data: UserUpdateDTO },
        { rejectWithValue }
    ) => {
        try {
            const response = await userService.updateUser(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to update user"
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id: number, { rejectWithValue }) => {
        try {
            await userService.deleteUser(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to delete user"
            );
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    "users/fetchDetails",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await userService.getUserById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch user"
            );
        }
    }
);

export const fetchProfile = createAsyncThunk(
    "users/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getProfile();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch profile"
            );
        }
    }
);

// Slice
const initialState: UserState = {
    users: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageNumber: 0,
        pageSize: 10,
    },
    loading: false,
    error: null,
    filters: {},
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.content.push(action.payload);
                state.users.totalElements += 1;
                state.loading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.content.findIndex(
                    user => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.users.content[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const index = state.users.content.findIndex(
                    user => user.id === action.payload
                );
                if (index !== -1) {
                    state.users.content[index].isActive = false;
                }
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch User Details
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                const index = state.users.content.findIndex(
                    user => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.users.content[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                const index = state.users.content.findIndex(
                    user => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.users.content[index] = action.payload;
                }
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setFilters, clearError } = userSlice.actions;
export default userSlice.reducer;