import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ShopCard } from "@/components/ShopCard";
import { AppointmentCard } from "@/components/AppointmentCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingList } from "@/components/LoadingState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { mockShops } from "@/lib/mockData";
import { getStoredAppointments } from "@/lib/storage";
import type { Appointment } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    const stored = await getStoredAppointments();
    const upcoming = stored.filter((a) => a.status === "upcoming");
    setAppointments(upcoming);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleShopPress = (shopId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ShopDetail", { shopId });
  };

  const handleAppointmentPress = (appointmentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("AppointmentDetail", { appointmentId });
  };

  const handleBookPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ExploreTab");
  };

  const popularShops = mockShops.slice(0, 4);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing["4xl"],
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
      >
        {/* Welcome Section */}
        <View style={styles.section}>
          <ThemedText type="h1">Welcome back</ThemedText>
          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
          >
            Ready for your next fresh cut?
          </ThemedText>
        </View>

        {/* Next Appointment */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Your Next Appointment
          </ThemedText>
          {loading ? (
            <LoadingList count={1} type="appointment" />
          ) : appointments.length > 0 ? (
            <AppointmentCard
              appointment={appointments[0]}
              onPress={() => handleAppointmentPress(appointments[0].id)}
            />
          ) : (
            <Pressable
              onPress={handleBookPress}
              style={({ pressed }) => [
                styles.bookCard,
                { backgroundColor: theme.accent, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Image
                source={require("../../assets/images/empty-home.png")}
                style={styles.bookCardImage}
                contentFit="contain"
              />
              <View style={styles.bookCardContent}>
                <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
                  Book Your First Appointment
                </ThemedText>
                <ThemedText
                  type="body"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    marginTop: Spacing.xs,
                  }}
                >
                  Find the perfect barbershop near you
                </ThemedText>
              </View>
              <Feather name="arrow-right" size={24} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* Popular Shops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h3">Popular Near You</ThemedText>
            <Pressable
              onPress={() => navigation.navigate("ExploreTab")}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <ThemedText type="small" style={{ color: theme.accent }}>
                See All
              </ThemedText>
            </Pressable>
          </View>
          {loading ? (
            <LoadingList count={2} type="shop" />
          ) : (
            popularShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onPress={() => handleShopPress(shop.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
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
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  bookCardImage: {
    width: 60,
    height: 60,
  },
  bookCardContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
