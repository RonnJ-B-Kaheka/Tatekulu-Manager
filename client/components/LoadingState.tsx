import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.xs,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.backgroundTertiary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ShopCardSkeleton() {
  return (
    <View style={styles.shopCard}>
      <Skeleton height={160} borderRadius={BorderRadius.md} />
      <View style={styles.shopCardContent}>
        <Skeleton
          width="70%"
          height={20}
          style={{ marginBottom: Spacing.sm }}
        />
        <Skeleton
          width="50%"
          height={16}
          style={{ marginBottom: Spacing.sm }}
        />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
}

export function StylistCardSkeleton() {
  return (
    <View style={styles.stylistCard}>
      <Skeleton width={70} height={70} borderRadius={35} />
      <Skeleton width={60} height={14} style={{ marginTop: Spacing.sm }} />
    </View>
  );
}

export function ServiceCardSkeleton() {
  return (
    <View style={styles.serviceCard}>
      <View style={{ flex: 1 }}>
        <Skeleton
          width="60%"
          height={18}
          style={{ marginBottom: Spacing.sm }}
        />
        <Skeleton width="80%" height={14} />
      </View>
      <View style={styles.serviceRight}>
        <Skeleton width={50} height={20} />
      </View>
    </View>
  );
}

export function AppointmentCardSkeleton() {
  return (
    <View style={styles.appointmentCard}>
      <Skeleton width={60} height={60} borderRadius={BorderRadius.sm} />
      <View style={styles.appointmentContent}>
        <Skeleton
          width="70%"
          height={18}
          style={{ marginBottom: Spacing.sm }}
        />
        <Skeleton
          width="50%"
          height={14}
          style={{ marginBottom: Spacing.xs }}
        />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
}

export function LoadingList({
  count = 3,
  type = "shop",
}: {
  count?: number;
  type?: "shop" | "stylist" | "service" | "appointment";
}) {
  const SkeletonComponent = {
    shop: ShopCardSkeleton,
    stylist: StylistCardSkeleton,
    service: ServiceCardSkeleton,
    appointment: AppointmentCardSkeleton,
  }[type];

  return (
    <View style={type === "stylist" ? styles.horizontalList : undefined}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shopCard: {
    marginBottom: Spacing.lg,
  },
  shopCardContent: {
    paddingTop: Spacing.md,
  },
  stylistCard: {
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  serviceRight: {
    alignItems: "flex-end",
  },
  appointmentCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  appointmentContent: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  horizontalList: {
    flexDirection: "row",
  },
});
