import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "../features/auth/slice";
import { ActivityIndicator, View } from "react-native";
import { AuthStack } from "./AuthStack";
import { HomeScreen } from "../features/home/HomeScreen"; // Placeholder
import { AppDispatch, store } from "../store";

import { BookingScreen } from "../features/booking/screens/BookingScreen";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

// Placeholder for separate role stacks
const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerHome" component={HomeScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

import { AdminDashboardScreen } from "../features/admin/screens/AdminDashboardScreen";

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminHome" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

import { NotificationService } from "../features/notifications/services/NotificationService";

export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // Setup offline sync listener
      NotificationService.setupSyncListener(dispatch, () => store.getState());

      // Register for push notifications
      NotificationService.registerForPushNotificationsAsync().then(token => {
        if (token) {
          console.log('Push token:', token);
          // dispatch(updatePushToken(token)); // Future implementation
        }
      });
    }
  }, [isAuthenticated, dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.role === "admin" ? (
          <AdminStack />
        ) : (
          <CustomerStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
