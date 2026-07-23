import { MOCK_BOOKING_REQUEST, MOCK_HISTORY } from './api';
import { BookingRequest, TripHistoryItem } from '../types';

let activeBooking: BookingRequest | null = { ...MOCK_BOOKING_REQUEST };

export async function getCurrentBookingRequest(): Promise<BookingRequest | null> {
  return Promise.resolve(activeBooking);
}

export async function acceptBooking(bookingId: string): Promise<boolean> {
  if (activeBooking && activeBooking.id === bookingId) {
    activeBooking.status = 'accepted';
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

export async function declineBooking(bookingId: string): Promise<boolean> {
  if (activeBooking && activeBooking.id === bookingId) {
    activeBooking.status = 'declined';
    activeBooking = null;
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

export async function updateTripStatus(
  status: BookingRequest['status']
): Promise<BookingRequest | null> {
  if (activeBooking) {
    activeBooking.status = status;
    return Promise.resolve(activeBooking);
  }
  return Promise.resolve(null);
}

export async function getTripHistory(): Promise<TripHistoryItem[]> {
  return Promise.resolve(MOCK_HISTORY);
}
