import { hasConflict, getAvailableSlots } from '../conflict';

describe('Booking Conflict Detection', () => {
    const existingBookings = [
        { startTime: '2023-10-27T10:00:00', duration: 30 }, // 10:00 - 10:30
        { startTime: '2023-10-27T14:00:00', duration: 60 }, // 14:00 - 15:00
    ];

    describe('hasConflict', () => {
        it('should detect a direct overlap', () => {
            // Trying to book 10:15 - 10:45
            const result = hasConflict('2023-10-27T10:15:00', 30, existingBookings);
            expect(result).toBe(true);
        });

        it('should detect an encompassing overlap', () => {
            // Trying to book 09:50 - 10:40 (covers existing booking)
            const result = hasConflict('2023-10-27T09:50:00', 50, existingBookings);
            expect(result).toBe(true);
        });

        it('should detect being encompassed by valid booking', () => {
            // Trying to book 14:15 - 14:30 (inside existing)
            const result = hasConflict('2023-10-27T14:15:00', 15, existingBookings);
            expect(result).toBe(true);
        });

        it('should allow booking before existing slots', () => {
            // 09:00 - 09:30
            const result = hasConflict('2023-10-27T09:00:00', 30, existingBookings);
            expect(result).toBe(false);
        });

        it('should allow booking after existing slots', () => {
            // 10:30 - 11:00 (Starts exactly when previous ends)
            const result = hasConflict('2023-10-27T10:30:00', 30, existingBookings);
            expect(result).toBe(false);
        });

        it('should allow booking between slots', () => {
            // 11:00 - 12:00
            const result = hasConflict('2023-10-27T11:00:00', 60, existingBookings);
            expect(result).toBe(false);
        });
    });

    describe('getAvailableSlots', () => {
        it('should filter out conflicting slots', () => {
            const date = '2023-10-27';
            const duration = 30;
            // existing bookings cover 10:00 and 14:00
            // expected slots list in conflict.ts includes 10:00, 10:30, 14:00, 14:30
            // 10:00 should be removed.
            // 10:30 is safe.
            // 14:00 should be removed.
            // 14:30 should be removed (overlaps with 14:00-15:00).

            const slots = getAvailableSlots(date, duration, existingBookings);

            expect(slots).not.toContain('10:00');
            expect(slots).toContain('10:30');
            expect(slots).not.toContain('14:00');
            expect(slots).not.toContain('14:30');
            expect(slots).toContain('15:00');
        });
    });
});
