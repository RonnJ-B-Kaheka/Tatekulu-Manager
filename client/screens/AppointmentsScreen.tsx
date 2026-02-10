import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AppointmentCard } from "@/components/AppointmentCard";
import { FilterChip } from "@/components/FilterChip";
import { EmptyState } from "@/components/EmptyState";
import { LoadingList } from "@/components/LoadingState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getStoredAppointments } from "@/lib/storage";
import type { Appointment } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = "upcoming" | "completed" | "cancelled";

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    const stored = await getStoredAppointments();
    setAppointments(stored);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, []),
  );

  const filteredAppointments = appointments.filter(
    (a) => a.status === activeFilter,
  );

  const handleFilterPress = (filter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  const handleAppointmentPress = (appointmentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("AppointmentDetail", { appointmentId });
  };

  const handleBookPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ExploreTab");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAppointments();
    setRefreshing(false);
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const getEmptyMessage = () => {
    switch (activeFilter) {
      case "upcoming":
        return "You don't have any upcoming appointments. Book one now!";
      case "completed":
        return "No completed appointments yet. Your history will appear here.";
      case "cancelled":
        return "No cancelled appointments.";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: headerHeight + Spacing.sm,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={styles.filtersRow}>
          {filters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              selected={activeFilter === filter.key}
              onPress={() => handleFilterPress(filter.key)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.md,
          paddingBottom: tabBarHeight + Spacing["2xl"],
          flexGrow: 1,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => handleAppointmentPress(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <LoadingList count={3} type="appointment" />
          ) : (
            <EmptyState
              image={require("../../assets/images/empty-appointments.png")}
              title="No Appointments"
              message={getEmptyMessage()}
              actionLabel={activeFilter === "upcoming" ? "Book Now" : undefined}
              onAction={
                activeFilter === "upcoming" ? handleBookPress : undefined
              }
            />
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  filtersRow: {
    flexDirection: "row",
  },
});
