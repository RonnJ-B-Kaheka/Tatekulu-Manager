import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
  selected?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ServiceCard({
  service,
  onPress,
  selected = false,
}: ServiceCardProps) {
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
        styles.card,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: selected ? theme.accent : theme.border,
          borderWidth: selected ? 2 : 1,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <ThemedText type="h4">{service.name}</ThemedText>
        <ThemedText
          type="small"
          numberOfLines={2}
          style={{ color: theme.textSecondary, marginTop: 2 }}
        >
          {service.description}
        </ThemedText>
        <View style={styles.metaRow}>
          <Feather name="clock" size={12} color={theme.textTertiary} />
          <ThemedText
            type="caption"
            style={{ marginLeft: 4, color: theme.textTertiary }}
          >
            {service.duration} min
          </ThemedText>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <ThemedText type="h3" style={{ color: theme.accent }}>
          ${service.price}
        </ThemedText>
        {selected ? (
          <View style={[styles.checkmark, { backgroundColor: theme.accent }]}>
            <Feather name="check" size={14} color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  priceContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
});
