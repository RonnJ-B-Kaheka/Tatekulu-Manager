import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { getStoredAppointments, getFavoriteShops } from "@/lib/storage";

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
}

function MenuItem({
  icon,
  label,
  onPress,
  danger = false,
  badge,
}: MenuItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: theme.backgroundDefault,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Feather
        name={icon}
        size={20}
        color={danger ? theme.error : theme.text}
      />
      <ThemedText
        type="body"
        style={[styles.menuLabel, { color: danger ? theme.error : theme.text }]}
      >
        {label}
      </ThemedText>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
            {badge}
          </ThemedText>
        </View>
      ) : null}
      <Feather name="chevron-right" size={20} color={theme.textTertiary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout, isAdmin } = useAuth();

  const [stats, setStats] = useState({ appointments: 0, favorites: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const appointments = await getStoredAppointments();
    const favorites = await getFavoriteShops();

    setStats({
      appointments: appointments.filter((a) => a.status === "completed").length,
      favorites: favorites.length,
    });
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleMenuPress = (item: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Coming Soon", `${item} feature is coming soon!`);
  };

  const displayName = user?.name || "Guest User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing["2xl"],
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <ThemedText type="h1" style={{ color: "#FFFFFF" }}>
              {initials}
            </ThemedText>
          </View>
          <ThemedText type="h2" style={styles.name}>
            {displayName}
          </ThemedText>
          {user?.email ? (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {user.email}
            </ThemedText>
          ) : null}
          {isAdmin ? (
            <View style={[styles.roleBadge, { backgroundColor: theme.accent }]}>
              <Feather name="shield" size={12} color="#FFFFFF" />
              <ThemedText
                type="caption"
                style={{ color: "#FFFFFF", marginLeft: 4 }}
              >
                Admin
              </ThemedText>
            </View>
          ) : null}
        </View>

        {/* Stats */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: theme.backgroundDefault },
            Shadows.small,
          ]}
        >
          <View style={styles.statItem}>
            <ThemedText type="h2" style={{ color: theme.accent }}>
              {stats.appointments}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Visits
            </ThemedText>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.statItem}>
            <ThemedText type="h2" style={{ color: theme.accent }}>
              {stats.favorites}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Favorites
            </ThemedText>
          </View>
        </View>

        {/* Admin Section */}
        {isAdmin ? (
          <View style={styles.menuSection}>
            <ThemedText type="small" style={styles.sectionTitle}>
              Admin
            </ThemedText>
            <View style={[styles.menuGroup, { borderColor: theme.border }]}>
              <MenuItem
                icon="bar-chart-2"
                label="Dashboard"
                onPress={() => handleMenuPress("Admin Dashboard")}
              />
              <MenuItem
                icon="users"
                label="Manage Users"
                onPress={() => handleMenuPress("Manage Users")}
              />
              <MenuItem
                icon="calendar"
                label="All Appointments"
                onPress={() => handleMenuPress("All Appointments")}
              />
            </View>
          </View>
        ) : null}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <ThemedText type="small" style={styles.sectionTitle}>
            Account
          </ThemedText>
          <View style={[styles.menuGroup, { borderColor: theme.border }]}>
            <MenuItem
              icon="heart"
              label="Favorite Shops"
              badge={stats.favorites > 0 ? `${stats.favorites}` : undefined}
              onPress={() => handleMenuPress("Favorite Shops")}
            />
            <MenuItem
              icon="credit-card"
              label="Payment Methods"
              onPress={() => handleMenuPress("Payment Methods")}
            />
            <MenuItem
              icon="bell"
              label="Notifications"
              onPress={() => handleMenuPress("Notifications")}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <ThemedText type="small" style={styles.sectionTitle}>
            Support
          </ThemedText>
          <View style={[styles.menuGroup, { borderColor: theme.border }]}>
            <MenuItem
              icon="help-circle"
              label="Help & Support"
              onPress={() => handleMenuPress("Help & Support")}
            />
            <MenuItem
              icon="file-text"
              label="Terms of Service"
              onPress={() => handleMenuPress("Terms of Service")}
            />
            <MenuItem
              icon="shield"
              label="Privacy Policy"
              onPress={() => handleMenuPress("Privacy Policy")}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={[styles.menuGroup, { borderColor: theme.border }]}>
            <MenuItem
              icon="log-out"
              label="Sign Out"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        {/* App Version */}
        <ThemedText
          type="caption"
          style={[styles.version, { color: theme.textTertiary }]}
        >
          Tatekulu v1.0.0
        </ThemedText>
      </KeyboardAwareScrollViewCompat>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  name: {
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    marginHorizontal: Spacing.xl,
  },
  menuSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuGroup: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  version: {
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
