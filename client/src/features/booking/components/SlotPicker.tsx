import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { format, addDays, isSameDay } from "date-fns";
import { Spacing, BorderRadius, Shadows } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";
import { Typography } from "../../../components/ui/Typography";

interface SlotPickerProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) => {
  const { theme } = useTheme();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoonSlots = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.sectionTitle}>Select Date</Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScroll}
      >
        {dates.map((date) => {
          const dateStr = date.toISOString();
          const isSelected = selectedDate
            ? isSameDay(new Date(selectedDate), date)
            : false;
          return (
            <TouchableOpacity
              key={dateStr}
              style={[
                styles.dateCard,
                { borderColor: theme.border, backgroundColor: theme.gray[100] },
                isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => onSelectDate(dateStr)}
            >
              <Typography
                variant="caption"
                bold
                color={isSelected ? theme.white : theme.gray[500]}
                style={styles.dayName}
              >
                {format(date, "EEE")}
              </Typography>
              <Typography
                variant="h3"
                color={isSelected ? theme.white : theme.black}
              >
                {format(date, "d")}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.timeSection}>
        <Typography variant="label" color={theme.gray[600]} style={styles.timeLabel}>Morning</Typography>
        <View style={styles.grid}>
          {morningSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                { backgroundColor: theme.card, borderColor: theme.border },
                selectedTime === time && { backgroundColor: theme.black, borderColor: theme.black },
              ]}
              onPress={() => onSelectTime(time)}
            >
              <Typography
                variant="body2"
                bold={selectedTime === time}
                color={selectedTime === time ? theme.white : theme.black}
              >
                {time}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        <Typography variant="label" color={theme.gray[600]} style={styles.timeLabel}>Afternoon</Typography>
        <View style={styles.grid}>
          {afternoonSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                { backgroundColor: theme.card, borderColor: theme.border },
                selectedTime === time && { backgroundColor: theme.black, borderColor: theme.black },
              ]}
              onPress={() => onSelectTime(time)}
            >
              <Typography
                variant="body2"
                bold={selectedTime === time}
                color={selectedTime === time ? theme.white : theme.black}
              >
                {time}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  timeLabel: {
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  dateScroll: {
    paddingBottom: Spacing.lg,
  },
  dateCard: {
    width: 65,
    height: 80,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
    borderWidth: 1,
  },
  dayName: {
    textTransform: "uppercase",
    marginBottom: 2,
  },
  timeSection: {
    marginTop: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.lg,
  },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
});
