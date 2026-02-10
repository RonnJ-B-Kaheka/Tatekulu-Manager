import { addMinutes } from 'date-fns';

test('date-fns loads', () => {
    expect(addMinutes(new Date(), 1)).toBeTruthy();
});
