import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import deviceReducer from "./device/deviceSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        devices: deviceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
