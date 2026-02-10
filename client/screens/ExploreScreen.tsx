import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { ShopCard } from "@/components/ShopCard";
import { FilterChip } from "@/components/FilterChip";
import { EmptyState } from "@/components/EmptyState";
import { LoadingList } from "@/components/LoadingState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { mockShops } from "@/lib/mockData";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = "all" | "near" | "top-rated" | "open";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filters: { key: FilterType; label: string; icon: any }[] = [
    { key: "all", label: "All", icon: undefined },
    { key: "near", label: "Near Me", icon: "map-pin" },
    { key: "top-rated", label: "Top Rated", icon: "star" },
    { key: "open", label: "Open Now", icon: "clock" },
  ];

  const filteredShops = useMemo(() => {
    let shops = [...mockShops];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      shops = shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.address.toLowerCase().includes(query),
      );
    }

    switch (activeFilter) {
      case "near":
        shops = shops.sort((a, b) => {
          const distA = parseFloat(a.distance?.replace(" km", "") || "0");
          const distB = parseFloat(b.distance?.replace(" km", "") || "0");
          return distA - distB;
        });
        break;
      case "top-rated":
        shops = shops.sort((a, b) => b.rating - a.rating);
        break;
      case "open":
        shops = shops.filter((shop) => shop.isOpen);
        break;
    }

    return shops;
  }, [searchQuery, activeFilter]);

  const handleFilterPress = (filter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  const handleShopPress = (shopId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ShopDetail", { shopId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            paddingTop: headerHeight + Spacing.sm,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Input
          placeholder="Search barbershops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          rightIcon={searchQuery ? "x" : undefined}
          onRightIconPress={() => setSearchQuery("")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              icon={filter.icon}
              selected={activeFilter === filter.key}
              onPress={() => handleFilterPress(filter.key)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredShops}
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
          <ShopCard shop={item} onPress={() => handleShopPress(item.id)} />
        )}
        ListEmptyComponent={
          loading ? (
            <LoadingList count={3} type="shop" />
          ) : (
            <EmptyState
              image={require("../../assets/images/empty-search.png")}
              title="No Barbershops Found"
              message={
                searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : "We couldn't find any barbershops matching your filters."
              }
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  filtersContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
});
