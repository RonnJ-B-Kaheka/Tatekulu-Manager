import React from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface DatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function DateButton({
  date,
  selected,
  onPress,
}: {
  date: Date;
  selected: boolean;
  onPress: () => void;
}) {
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

  const isToday = isSameDay(date, startOfToday());

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.dateButton,
        {
          backgroundColor: selected ? theme.accent : theme.backgroundDefault,
          borderColor: selected ? theme.accent : theme.border,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        type="caption"
        style={{
          color: selected ? "#FFFFFF" : theme.textSecondary,
          fontWeight: "500",
        }}
      >
        {format(date, "EEE")}
      </ThemedText>
      <ThemedText
        type="h3"
        style={{
          color: selected ? "#FFFFFF" : theme.text,
        }}
      >
        {format(date, "d")}
      </ThemedText>
      {isToday ? (
        <View
          style={[
            styles.todayDot,
            { backgroundColor: selected ? "#FFFFFF" : theme.accent },
          ]}
        />
      ) : null}
    </AnimatedPressable>
  );
}

export function DatePicker({
  selectedDate,
  onSelectDate,
  daysToShow = 14,
}: DatePickerProps) {
  const today = startOfToday();
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));

  return (
    <View style={styles.container}>
      <ThemedText type="h4" style={styles.monthLabel}>
        {format(selectedDate, "MMMM yyyy")}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => (
          <DateButton
            key={date.toISOString()}
            date={date}
            selected={isSameDay(date, selectedDate)}
            onPress={() => onSelectDate(date)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  monthLabel: {
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dateButton: {
    width: 56,
    height: 72,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
