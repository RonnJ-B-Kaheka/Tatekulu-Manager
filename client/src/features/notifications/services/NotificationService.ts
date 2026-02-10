import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch, RootState } from '../../../store';
import { clearSyncQueue, markAsRead } from '../slice';

export class NotificationService {
    static async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return null;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    }

    static setupSyncListener(dispatch: AppDispatch, getState: () => RootState) {
        NetInfo.addEventListener(state => {
            if (state.isConnected && state.isInternetReachable) {
                const { syncQueue } = getState().notifications;
                if (syncQueue.length > 0) {
                    this.flushSyncQueue(dispatch, syncQueue);
                }
            }
        });
    }

    private static async flushSyncQueue(dispatch: AppDispatch, queue: string[]) {
        try {
            // Mock API call to sync read status
            console.log('Syncing notification status with server...', queue);
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch(clearSyncQueue());
        } catch (error) {
            console.error('Failed to sync notifications', error);
        }
    }
}
