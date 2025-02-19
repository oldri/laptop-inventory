import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import deviceReducer from "./deviceSlice";
import deviceRequestReducer from "./deviceRequestSlice";
import userReducer from "./userSlice";
import dashboardReducer from "./dashboardSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        devices: deviceReducer,
        deviceRequests: deviceRequestReducer,
        users: userReducer,
        dashboard: dashboardReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
