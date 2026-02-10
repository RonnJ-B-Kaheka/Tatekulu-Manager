import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { getStoredAppointments, cancelAppointment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Appointment } from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AppointmentDetailRouteProp = RouteProp<
  RootStackParamList,
  "AppointmentDetail"
>;

export default function AppointmentDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AppointmentDetailRouteProp>();

  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    const appointments = await getStoredAppointments();
    const found = appointments.find((a) => a.id === appointmentId);
    setAppointment(found || null);
  };

  const handleCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Cancel Appointment",
          style: "destructive",
          onPress: async () => {
            await cancelAppointment(appointmentId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleReschedule = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Coming Soon", "Rescheduling feature is coming soon!");
  };

  const handleGetDirections = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Coming Soon", "Directions feature is coming soon!");
  };

  if (!appointment) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const formattedDate = format(
    parseISO(appointment.date),
    "EEEE, MMMM d, yyyy",
  );
  const isUpcoming = appointment.status === "upcoming";

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingHorizontal: Spacing.lg,
          paddingBottom: isUpcoming
            ? 140 + insets.bottom
            : insets.bottom + Spacing["2xl"],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Shop Info */}
        <View
          style={[
            styles.shopCard,
            { backgroundColor: theme.backgroundDefault },
            Shadows.small,
          ]}
        >
          <Image
            source={{ uri: appointment.shop.imageUrl }}
            style={styles.shopImage}
            contentFit="cover"
          />
          <View style={styles.shopContent}>
            <ThemedText type="h3">{appointment.shop.name}</ThemedText>
            <View style={styles.shopMeta}>
              <Feather name="map-pin" size={14} color={theme.textSecondary} />
              <ThemedText
                type="small"
                style={{ marginLeft: 4, color: theme.textSecondary }}
              >
                {appointment.shop.address}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  appointment.status === "upcoming"
                    ? theme.accent
                    : appointment.status === "completed"
                      ? theme.success
                      : theme.error,
              },
            ]}
          >
            <Feather
              name={
                appointment.status === "upcoming"
                  ? "clock"
                  : appointment.status === "completed"
                    ? "check"
                    : "x"
              }
              size={16}
              color="#FFFFFF"
            />
            <ThemedText type="body" style={{ color: "#FFFFFF", marginLeft: 8 }}>
              {appointment.status === "upcoming"
                ? "Upcoming"
                : appointment.status === "completed"
                  ? "Completed"
                  : "Cancelled"}
            </ThemedText>
          </View>
        </View>

        {/* Appointment Details */}
        <View
          style={[
            styles.detailsCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <ThemedText type="h4" style={styles.cardTitle}>
            Appointment Details
          </ThemedText>

          <View style={styles.detailRow}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="scissors" size={18} color={theme.accent} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Service
              </ThemedText>
              <ThemedText type="body">{appointment.service.name}</ThemedText>
            </View>
            <ThemedText type="h4" style={{ color: theme.accent }}>
              ${appointment.service.price}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="user" size={18} color={theme.accent} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Stylist
              </ThemedText>
              <ThemedText type="body">{appointment.stylist.name}</ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="calendar" size={18} color={theme.accent} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Date & Time
              </ThemedText>
              <ThemedText type="body">
                {formattedDate} at {appointment.time}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="clock" size={18} color={theme.accent} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Duration
              </ThemedText>
              <ThemedText type="body">
                {appointment.service.duration} minutes
              </ThemedText>
            </View>
          </View>

          {appointment.notes ? (
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="file-text" size={18} color={theme.accent} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Notes
                </ThemedText>
                <ThemedText type="body">{appointment.notes}</ThemedText>
              </View>
            </View>
          ) : null}
        </View>

        {/* Get Directions Button */}
        <Pressable
          onPress={handleGetDirections}
          style={({ pressed }) => [
            styles.directionsButton,
            { borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="navigation" size={20} color={theme.accent} />
          <ThemedText
            type="body"
            style={{ marginLeft: Spacing.sm, color: theme.accent }}
          >
            Get Directions
          </ThemedText>
        </Pressable>
      </ScrollView>

      {/* Bottom Actions */}
      {isUpcoming ? (
        <View
          style={[
            styles.bottomContainer,
            {
              paddingBottom: insets.bottom + Spacing.lg,
              backgroundColor: theme.backgroundRoot,
              borderTopColor: theme.border,
            },
          ]}
        >
          <View style={styles.bottomActions}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                { borderColor: theme.error, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <ThemedText type="button" style={{ color: theme.error }}>
                Cancel
              </ThemedText>
            </Pressable>
            <Button onPress={handleReschedule} style={{ flex: 1 }}>
              Reschedule
            </Button>
          </View>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  shopCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
  },
  shopContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  shopMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  detailsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  bottomActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
