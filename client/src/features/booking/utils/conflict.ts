import { addMinutes, areIntervalsOverlapping, parseISO } from "date-fns";

interface Appointment {
  startTime: string; // ISO
  duration: number; // minutes
}

/**
 * Checks if a requested slot overlaps with any existing bookings
 */
export const hasConflict = (
  requestedTime: string,
  duration: number,
  existingBookings: Appointment[],
): boolean => {
  const start = parseISO(requestedTime);
  const end = addMinutes(start, duration);

  return existingBookings.some((booking) => {
    const bookingStart = parseISO(booking.startTime);
    const bookingEnd = addMinutes(bookingStart, booking.duration);

    return areIntervalsOverlapping(
      { start, end },
      { start: bookingStart, end: bookingEnd },
    );
  });
};

/**
 * Generates available time slots for a specific day
 */
export const getAvailableSlots = (
  date: string,
  duration: number,
  bookings: Appointment[],
): string[] => {
  // In a real app, this would be more complex (barber availability, shop hours)
  // For this demo, we verify a fixed set of slots against conflicts.
  const possibleSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  return possibleSlots.filter((time) => {
    const dateTime = `${date.split("T")[0]}T${time}:00`;
    return !hasConflict(dateTime, duration, bookings);
  });
};
