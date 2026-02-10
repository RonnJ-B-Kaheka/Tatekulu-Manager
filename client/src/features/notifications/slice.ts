import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'booking' | 'payment' | 'system' | 'revenue';
    timestamp: string;
    isRead: boolean;
}

interface NotificationState {
    items: Notification[];
    unreadCount: number;
    syncQueue: string[]; // IDs of notifications marked as read while offline
}

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    syncQueue: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.items.find(n => n.id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
                state.syncQueue.push(action.payload);
            }
        },
        clearSyncQueue: (state) => {
            state.syncQueue = [];
        },
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        }
    },
});

export const { addNotification, markAsRead, clearSyncQueue, setNotifications } = notificationSlice.actions;

const persistConfig = {
    key: 'notifications',
    storage: AsyncStorage,
    whitelist: ['items', 'unreadCount', 'syncQueue'],
};

export const persistedNotificationReducer = persistReducer(persistConfig, notificationSlice.reducer);
export default notificationSlice.reducer;
