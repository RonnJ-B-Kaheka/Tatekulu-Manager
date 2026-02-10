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
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Stylist } from "@/types";

interface StylistCardProps {
  stylist: Stylist;
  onPress?: () => void;
  selected?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StylistCard({
  stylist,
  onPress,
  selected = false,
}: StylistCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View
        style={[
          styles.avatarContainer,
          {
            borderColor: selected ? theme.accent : "transparent",
            borderWidth: selected ? 3 : 0,
          },
        ]}
      >
        <Image
          source={{ uri: stylist.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>
      <ThemedText type="small" numberOfLines={1} style={styles.name}>
        {stylist.name.split(" ")[0]}
      </ThemedText>
      <View style={styles.ratingRow}>
        <Feather name="star" size={10} color={theme.accent} />
        <ThemedText type="caption" style={{ marginLeft: 2 }}>
          {stylist.rating}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

export function StylistCardLarge({
  stylist,
  onPress,
  selected = false,
}: StylistCardProps) {
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

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.largeCard,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: selected ? theme.accent : theme.border,
          borderWidth: selected ? 2 : 1,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={{ uri: stylist.avatarUrl }}
        style={styles.largeAvatar}
        contentFit="cover"
      />
      <View style={styles.largeContent}>
        <ThemedText type="h4">{stylist.name}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {stylist.specialty}
        </ThemedText>
        <View style={[styles.ratingRow, { marginTop: Spacing.xs }]}>
          <Feather name="star" size={12} color={theme.accent} />
          <ThemedText type="small" style={{ marginLeft: 4 }}>
            {stylist.rating} ({stylist.reviewCount} reviews)
          </ThemedText>
        </View>
      </View>
      {selected ? (
        <View style={[styles.checkmark, { backgroundColor: theme.accent }]}>
          <Feather name="check" size={14} color="#FFFFFF" />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
    marginRight: Spacing.md,
  },
  avatarContainer: {
    borderRadius: 35,
    overflow: "hidden",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    marginTop: Spacing.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  largeCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  largeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  largeContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
