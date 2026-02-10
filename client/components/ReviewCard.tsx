import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <View
          style={[styles.avatar, { backgroundColor: theme.backgroundTertiary }]}
        >
          <ThemedText type="h4">{review.userName[0]}</ThemedText>
        </View>
        <View style={styles.headerContent}>
          <ThemedText type="h4">{review.userName}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textTertiary }}>
            {format(parseISO(review.createdAt), "MMM d, yyyy")}
          </ThemedText>
        </View>
        <View style={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Feather
              key={i}
              name="star"
              size={14}
              color={i < review.rating ? theme.accent : theme.border}
              style={{ marginLeft: 2 }}
            />
          ))}
        </View>
      </View>
      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {review.comment}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rating: {
    flexDirection: "row",
  },
});
