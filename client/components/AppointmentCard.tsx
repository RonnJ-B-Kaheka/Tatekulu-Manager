import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppointmentCard({
  appointment,
  onPress,
}: AppointmentCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case "upcoming":
        return theme.accent;
      case "completed":
        return theme.success;
      case "cancelled":
        return theme.error;
      default:
        return theme.textTertiary;
    }
  };

  const getStatusLabel = () => {
    switch (appointment.status) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "";
    }
  };

  const formattedDate = format(parseISO(appointment.date), "EEE, MMM d");

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
        animatedStyle,
      ]}
    >
      <Image
        source={{ uri: appointment.shop.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="h4" numberOfLines={1} style={{ flex: 1 }}>
            {appointment.shop.name}
          </ThemedText>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
              {getStatusLabel()}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginTop: 2 }}
        >
          {appointment.service.name} with {appointment.stylist.name}
        </ThemedText>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={12} color={theme.textTertiary} />
            <ThemedText
              type="caption"
              style={{ marginLeft: 4, color: theme.textTertiary }}
            >
              {formattedDate}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color={theme.textTertiary} />
            <ThemedText
              type="caption"
              style={{ marginLeft: 4, color: theme.textTertiary }}
            >
              {appointment.time}
            </ThemedText>
          </View>
        </View>
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={theme.textTertiary}
        style={styles.chevron}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
});
