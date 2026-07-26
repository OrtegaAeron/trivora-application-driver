import { MOCK_BOOKING_REQUEST, MOCK_HISTORY } from './api';
import { BookingRequest, TripHistoryItem } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/driver';

let activeBooking: BookingRequest | null = { ...MOCK_BOOKING_REQUEST };

export async function getCurrentBookingRequest(): Promise<BookingRequest | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/pending`);
    if (response.ok) {
      const data = await response.json();
      if (data.requests && data.requests.length > 0) {
        const req = data.requests[0];
        return {
          id: String(req.id),
          passenger: {
            id: String(req.passenger_id),
            name: req.passenger?.user?.name || 'Passenger',
            rating: req.passenger?.rating || 4.85,
            mobile: req.passenger?.mobile_number || '+63 900 000 0000',
            totalRides: req.passenger?.total_rides || 10,
          },
          pickupLocation: req.pickup_name,
          pickupCoords: { latitude: req.pickup_lat, longitude: req.pickup_lng },
          destination: req.dropoff_name,
          destinationCoords: { latitude: req.dropoff_lat, longitude: req.dropoff_lng },
          fare: `₱${req.fare_amount}`,
          distance: `${req.distance_km} km`,
          eta: `${req.estimated_duration_mins} mins`,
          notes: req.passenger_notes || '',
          createdAt: 'Just now',
          status: req.status || 'pending',
        };
      }
    }
  } catch (err) {
    console.log('[Driver Booking API] Using fallback mock data');
  }
  return Promise.resolve(activeBooking);
}

export async function acceptBooking(bookingId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      if (activeBooking) activeBooking.status = 'accepted';
      return true;
    }
  } catch (err) {
    console.log('[Driver Accept Booking API] Using fallback mode');
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/history`);
    if (response.ok) {
      const data = await response.json();
      if (data.history && data.history.length > 0) {
        return data.history.map((h: any) => ({
          id: String(h.id),
          date: h.requested_at || 'Today',
          passengerName: h.passenger?.user?.name || 'Passenger',
          pickup: h.pickup_name,
          destination: h.dropoff_name,
          fare: `₱${h.fare_amount}`,
          status: h.status === 'completed' ? 'Completed' : h.status === 'cancelled' ? 'Cancelled' : h.status,
        }));
      }
    }
  } catch (err) {
    console.log('[Driver Trip History API] Using fallback mock data');
  }
  return Promise.resolve(MOCK_HISTORY);
}
