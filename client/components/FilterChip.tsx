import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FilterChip({
  label,
  selected = false,
  icon,
  onPress,
}: FilterChipProps) {
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
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.accent : theme.backgroundDefault,
          borderColor: selected ? theme.accent : theme.border,
        },
        animatedStyle,
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={14}
          color={selected ? "#FFFFFF" : theme.text}
          style={{ marginRight: Spacing.xs }}
        />
      ) : null}
      <ThemedText
        type="small"
        style={{
          color: selected ? "#FFFFFF" : theme.text,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
});
