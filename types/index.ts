export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  plateNumber: string;
  toda: string;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  avatarUrl?: string;
}

export interface PassengerInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  mobile: string;
  totalRides: number;
}

export interface BookingRequest {
  id: string;
  passenger: PassengerInfo;
  pickupLocation: string;
  pickupCoords: { latitude: number; longitude: number };
  destination: string;
  destinationCoords: { latitude: number; longitude: number };
  fare: string;
  distance: string;
  eta: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'en_route_pickup' | 'arrived' | 'passenger_onboard' | 'completed' | 'cancelled';
}

export interface QuickStats {
  todayEarnings: string;
  completedTrips: number;
  acceptanceRate: string;
  driverRating: number;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  passengerName: string;
  pickup: string;
  destination: string;
  fare: string;
  status: 'Completed' | 'Cancelled';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'cancellation' | 'completed' | 'payment' | 'system';
  unread: boolean;
}
