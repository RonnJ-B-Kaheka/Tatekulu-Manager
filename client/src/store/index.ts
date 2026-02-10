import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from 'redux-persist';
import authReducer from "../features/auth/slice";
import bookingReducer from "../features/booking/slice";
import { persistedNotificationReducer } from "../features/notifications/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    notifications: persistedNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
