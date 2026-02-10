import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { Barbershop } from "@/types";

interface ShopCardProps {
  shop: Barbershop;
  onPress?: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ShopCard({ shop, onPress, compact = false }: ShopCardProps) {
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

  if (compact) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.compactCard,
          { backgroundColor: theme.backgroundDefault },
          Shadows.small,
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: shop.imageUrl }}
          style={styles.compactImage}
          contentFit="cover"
        />
        <View style={styles.compactContent}>
          <ThemedText type="h4" numberOfLines={1}>
            {shop.name}
          </ThemedText>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color={theme.accent} />
            <ThemedText type="small" style={{ marginLeft: 4 }}>
              {shop.rating}
            </ThemedText>
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: shop.isOpen ? theme.success : theme.textTertiary,
            },
          ]}
        >
          <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
            {shop.isOpen ? "Open" : "Closed"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.content}>
        <ThemedText type="h3" numberOfLines={1}>
          {shop.name}
        </ThemedText>
        <View style={styles.infoRow}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color={theme.accent} />
            <ThemedText type="small" style={{ marginLeft: 4 }}>
              {shop.rating} ({shop.reviewCount})
            </ThemedText>
          </View>
          {shop.distance ? (
            <View style={styles.distanceRow}>
              <Feather name="map-pin" size={14} color={theme.textSecondary} />
              <ThemedText
                type="small"
                style={{ marginLeft: 4, color: theme.textSecondary }}
              >
                {shop.distance}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText
          type="small"
          numberOfLines={1}
          style={{ color: theme.textSecondary }}
        >
          {shop.address}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.md,
  },
  statusBadge: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  content: {
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactCard: {
    width: 160,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  compactImage: {
    width: "100%",
    height: 100,
  },
  compactContent: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
});
