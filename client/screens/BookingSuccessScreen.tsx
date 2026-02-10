import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BookingSuccessRouteProp = RouteProp<RootStackParamList, "BookingSuccess">;

export default function BookingSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookingSuccessRouteProp>();

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacity.value = withDelay(200, withSpring(1));
    translateY.value = withDelay(200, withSpring(0));
  }, []);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleViewAppointments = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "AppointmentsTab" } }],
    });
  };

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.content, { paddingTop: insets.top + Spacing["4xl"] }]}
      >
        <Animated.View style={imageStyle}>
          <Image
            source={require("../../assets/images/success-booking.png")}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.textContent, contentStyle]}>
          <ThemedText type="h1" style={styles.title}>
            Booking Confirmed!
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.message, { color: theme.textSecondary }]}
          >
            Your appointment has been booked successfully. We've sent a
            confirmation to your email.
          </ThemedText>
        </Animated.View>
      </View>

      <View
        style={[styles.actions, { paddingBottom: insets.bottom + Spacing.lg }]}
      >
        <Button onPress={handleViewAppointments} style={styles.button}>
          View My Appointments
        </Button>
        <Button
          onPress={handleGoHome}
          style={[
            styles.button,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText type="button" style={{ color: theme.text }}>
            Back to Home
          </ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: Spacing["2xl"],
  },
  textContent: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  message: {
    textAlign: "center",
    maxWidth: 300,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  button: {
    width: "100%",
  },
});
