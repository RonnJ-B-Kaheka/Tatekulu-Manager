import React from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { TimeSlot } from "@/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSelectSlot: (slotId: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TimeSlotButton({
  slot,
  selected,
  onPress,
}: {
  slot: TimeSlot;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (slot.available) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={slot.available ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!slot.available}
      style={[
        styles.slot,
        {
          backgroundColor: selected
            ? theme.accent
            : slot.available
              ? theme.backgroundDefault
              : theme.backgroundTertiary,
          borderColor: selected ? theme.accent : theme.border,
          opacity: slot.available ? 1 : 0.5,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        type="small"
        style={{
          color: selected
            ? "#FFFFFF"
            : slot.available
              ? theme.text
              : theme.textTertiary,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {slot.time}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(":")[0]);
    return hour >= 17;
  });

  return (
    <View style={styles.container}>
      {morningSlots.length > 0 ? (
        <View style={styles.section}>
          <ThemedText type="small" style={styles.sectionTitle}>
            Morning
          </ThemedText>
          <View style={styles.grid}>
            {morningSlots.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                slot={slot}
                selected={selectedSlot === slot.id}
                onPress={() => onSelectSlot(slot.id)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {afternoonSlots.length > 0 ? (
        <View style={styles.section}>
          <ThemedText type="small" style={styles.sectionTitle}>
            Afternoon
          </ThemedText>
          <View style={styles.grid}>
            {afternoonSlots.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                slot={slot}
                selected={selectedSlot === slot.id}
                onPress={() => onSelectSlot(slot.id)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {eveningSlots.length > 0 ? (
        <View style={styles.section}>
          <ThemedText type="small" style={styles.sectionTitle}>
            Evening
          </ThemedText>
          <View style={styles.grid}>
            {eveningSlots.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                slot={slot}
                selected={selectedSlot === slot.id}
                onPress={() => onSelectSlot(slot.id)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: "600",
    opacity: 0.7,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  slot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
  },
});
