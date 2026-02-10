import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format, startOfToday } from "date-fns";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StylistCardLarge } from "@/components/StylistCard";
import { ServiceCard } from "@/components/ServiceCard";
import { DatePicker } from "@/components/DatePicker";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  getShopById,
  getStylistsByShopId,
  getServicesByShopId,
  generateTimeSlots,
} from "@/lib/mockData";
import { addAppointment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type {
  Barbershop,
  Stylist,
  Service,
  TimeSlot,
  Appointment,
} from "@/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BookingRouteProp = RouteProp<RootStackParamList, "BookingFlow">;

type Step = "service" | "stylist" | "datetime" | "confirm";

export default function BookingFlowScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookingRouteProp>();

  const { shopId } = route.params;

  const [step, setStep] = useState<Step>("service");
  const [shop, setShop] = useState<Barbershop | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const shopData = getShopById(shopId);
    if (shopData) {
      setShop(shopData);
      setStylists(getStylistsByShopId(shopId));
      setServices(getServicesByShopId(shopId));
    }
  }, [shopId]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
    setSelectedSlot(null);
  }, [selectedDate]);

  const handleServiceSelect = (service: Service) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedService(service);
  };

  const handleStylistSelect = (stylist: Stylist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedStylist(stylist);
  };

  const handleSlotSelect = (slotId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSlot(slotId);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    switch (step) {
      case "service":
        setStep("stylist");
        break;
      case "stylist":
        setStep("datetime");
        break;
      case "datetime":
        setStep("confirm");
        break;
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (step) {
      case "stylist":
        setStep("service");
        break;
      case "datetime":
        setStep("stylist");
        break;
      case "confirm":
        setStep("datetime");
        break;
    }
  };

  const handleConfirm = async () => {
    if (!shop || !selectedService || !selectedStylist || !selectedSlot) return;

    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const slot = timeSlots.find((s) => s.id === selectedSlot);
    if (!slot) return;

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      userId: "user-1",
      shopId: shop.id,
      stylistId: selectedStylist.id,
      serviceId: selectedService.id,
      date: selectedDate.toISOString(),
      time: slot.time,
      status: "upcoming",
      shop,
      stylist: selectedStylist,
      service: selectedService,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await addAppointment(appointment);

    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate("BookingSuccess", { appointmentId: appointment.id });
    }, 500);
  };

  const canProceed = () => {
    switch (step) {
      case "service":
        return !!selectedService;
      case "stylist":
        return !!selectedStylist;
      case "datetime":
        return !!selectedSlot;
      case "confirm":
        return true;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "service":
        return "Select Service";
      case "stylist":
        return "Choose Stylist";
      case "datetime":
        return "Pick Date & Time";
      case "confirm":
        return "Confirm Booking";
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case "service":
        return 1;
      case "stylist":
        return 2;
      case "datetime":
        return 3;
      case "confirm":
        return 4;
    }
  };

  if (!shop) return null;

  return (
    <ThemedView style={styles.container}>
      {/* Progress Indicator */}
      <View
        style={[
          styles.progressContainer,
          {
            paddingTop: headerHeight + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((num) => (
            <View key={num} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      num <= getStepNumber() ? theme.accent : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color:
                      num <= getStepNumber() ? "#FFFFFF" : theme.textTertiary,
                    fontWeight: "600",
                  }}
                >
                  {num}
                </ThemedText>
              </View>
              {num < 4 ? (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor:
                        num < getStepNumber() ? theme.accent : theme.border,
                    },
                  ]}
                />
              ) : null}
            </View>
          ))}
        </View>
        <ThemedText type="h3" style={styles.stepTitle}>
          {getStepTitle()}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.lg,
          paddingBottom: 120 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {step === "service" ? (
          <View>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService?.id === service.id}
                onPress={() => handleServiceSelect(service)}
              />
            ))}
          </View>
        ) : null}

        {step === "stylist" ? (
          <View>
            {stylists.map((stylist) => (
              <StylistCardLarge
                key={stylist.id}
                stylist={stylist}
                selected={selectedStylist?.id === stylist.id}
                onPress={() => handleStylistSelect(stylist)}
              />
            ))}
          </View>
        ) : null}

        {step === "datetime" ? (
          <View style={{ gap: Spacing.xl }}>
            <DatePicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <TimeSlotPicker
              slots={timeSlots}
              selectedSlot={selectedSlot ?? undefined}
              onSelectSlot={handleSlotSelect}
            />
          </View>
        ) : null}

        {step === "confirm" ? (
          <View style={{ gap: Spacing.lg }}>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
                Booking Summary
              </ThemedText>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  Shop
                </ThemedText>
                <ThemedText type="body">{shop.name}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  Service
                </ThemedText>
                <ThemedText type="body">{selectedService?.name}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  Stylist
                </ThemedText>
                <ThemedText type="body">{selectedStylist?.name}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  Date
                </ThemedText>
                <ThemedText type="body">
                  {format(selectedDate, "EEE, MMM d, yyyy")}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  Time
                </ThemedText>
                <ThemedText type="body">
                  {timeSlots.find((s) => s.id === selectedSlot)?.time}
                </ThemedText>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <ThemedText type="h4">Total</ThemedText>
                <ThemedText type="h3" style={{ color: theme.accent }}>
                  ${selectedService?.price}
                </ThemedText>
              </View>
            </View>

            <Input
              label="Notes (optional)"
              placeholder="Any special requests..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={{
                height: 80,
                textAlignVertical: "top",
                paddingTop: Spacing.md,
              }}
            />
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
            borderTopColor: theme.border,
          },
        ]}
      >
        <View style={styles.bottomActions}>
          {step !== "service" ? (
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                { borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </Pressable>
          ) : null}
          <Button
            onPress={step === "confirm" ? handleConfirm : handleNext}
            disabled={!canProceed() || isSubmitting}
            style={{ flex: 1 }}
          >
            {step === "confirm"
              ? isSubmitting
                ? "Booking..."
                : "Confirm Booking"
              : "Continue"}
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
  },
  stepTitle: {
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  bottomActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
