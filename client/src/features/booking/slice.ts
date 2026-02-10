import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  image?: string;
}

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  imageUrl?: string;
}

interface BookingState {
  currentStep: number;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: string | null; // ISO Date string (YYYY-MM-DD)
  selectedTimeSlot: string | null; // ISO time string
  paymentMethod: "card" | "cash" | "apple_pay" | null;
}

const initialState: BookingState = {
  currentStep: 1,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTimeSlot: null,
  paymentMethod: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    selectService: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;
      // Reset subsequent steps if checking service changes
      if (state.currentStep > 1) {
        state.currentStep = 2; // Move to next natural step
        state.selectedBarber = null;
        state.selectedDate = null;
        state.selectedTimeSlot = null;
      } else {
        state.currentStep = 2;
      }
    },
    selectBarber: (state, action: PayloadAction<Barber>) => {
      state.selectedBarber = action.payload;
      state.currentStep = 3;
    },
    selectSlot: (
      state,
      action: PayloadAction<{ date: string; time: string }>,
    ) => {
      state.selectedDate = action.payload.date;
      state.selectedTimeSlot = action.payload.time;
      state.currentStep = 4;
    },
    setPaymentMethod: (
      state,
      action: PayloadAction<"card" | "cash" | "apple_pay">,
    ) => {
      state.paymentMethod = action.payload;
    },
    resetBooking: (state) => {
      return initialState;
    },
  },
});

export const {
  setStep,
  selectService,
  selectBarber,
  selectSlot,
  setPaymentMethod,
  resetBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
