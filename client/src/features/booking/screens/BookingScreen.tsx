import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  selectService,
  selectBarber,
  selectSlot,
  setStep,
  Service,
  Barber,
} from "../slice";
import { ServiceCard } from "../components/ServiceCard";
import { SlotPicker } from "../components/SlotPicker";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Button } from "../../../components/ui/Button";
import { Typography } from "../../../components/ui/Typography";
import { Spacing } from "../../../theme";
import { useTheme } from "../../../theme/ThemeContext";

// Mock Data
const SERVICES: Service[] = [
  { id: "1", name: "Fresh Cut", price: 25, duration: 45 },
  { id: "2", name: "Beard Trim", price: 15, duration: 20 },
  { id: "3", name: "Full Service", price: 40, duration: 60 },
];

const BARBERS: Barber[] = [
  { id: "1", name: "Mike The Barber", specialties: ["Fades"] },
  { id: "2", name: "Sarah Cuts", specialties: ["Designs"] },
];

export const BookingScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const {
    currentStep,
    selectedService,
    selectedBarber,
    selectedDate,
    selectedTimeSlot,
  } = useSelector((state: RootState) => state.booking);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false);
    Alert.alert(
      "Booking Confirmed!",
      `See you on ${selectedDate} at ${selectedTimeSlot}`,
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Typography variant="h2">Book Appointment</Typography>
        <Typography variant="body2" color={theme.textSecondary}>
          Step {currentStep} of 4
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <View>
            <Typography variant="h3" style={styles.heading}>Choose Service</Typography>
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                onPress={(s) => dispatch(selectService(s))}
              />
            ))}
          </View>
        )}

        {/* Step 2: Barber Selection */}
        {currentStep === 2 && (
          <View>
            <Typography variant="h3" style={styles.heading}>Choose Barber</Typography>
            {BARBERS.map((barber) => (
              <Button
                key={barber.id}
                title={barber.name}
                variant={
                  selectedBarber?.id === barber.id ? "primary" : "outline"
                }
                onPress={() => dispatch(selectBarber(barber))}
                style={styles.barberButton}
              />
            ))}
          </View>
        )}

        {/* Step 3: Date/Time */}
        {currentStep === 3 && (
          <SlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTimeSlot}
            onSelectDate={(d) =>
              dispatch(selectSlot({ date: d, time: "09:00" }))
            }
            onSelectTime={(t) => {
              if (selectedDate) {
                dispatch(selectSlot({ date: selectedDate, time: t }));
                setModalVisible(true);
              } else {
                Alert.alert("Pick a date first");
              }
            }}
          />
        )}
      </ScrollView>

      {/* Navigation Buttons (Back) */}
      {currentStep > 1 && (
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <Button
            title="Back"
            variant="secondary"
            onPress={() => dispatch(setStep(currentStep - 1))}
          />
        </View>
      )}

      <ConfirmationModal
        visible={modalVisible}
        service={selectedService}
        barber={selectedBarber}
        date={selectedDate}
        time={selectedTimeSlot}
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.xl, paddingBottom: Spacing.sm },
  scroll: { padding: Spacing.xl },
  heading: { marginBottom: Spacing.lg },
  barberButton: { marginBottom: Spacing.md },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
  },
});

