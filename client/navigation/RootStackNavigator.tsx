import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import ShopDetailScreen from "@/screens/ShopDetailScreen";
import BookingFlowScreen from "@/screens/BookingFlowScreen";
import BookingSuccessScreen from "@/screens/BookingSuccessScreen";
import AppointmentDetailScreen from "@/screens/AppointmentDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Auth: undefined;
  Main: { screen?: string } | undefined;
  ShopDetail: { shopId: string };
  BookingFlow: { shopId: string };
  BookingSuccess: { appointmentId: string };
  AppointmentDetail: { appointmentId: string };
  HomeTab: undefined;
  ExploreTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ShopDetail"
            component={ShopDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BookingFlow"
            component={BookingFlowScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="BookingSuccess"
            component={BookingSuccessScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="AppointmentDetail"
            component={AppointmentDetailScreen}
            options={{
              headerTitle: "Appointment",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
