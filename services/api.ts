import { DriverProfile, BookingRequest, TripHistoryItem, AppNotification, QuickStats } from '../types';

export const MOCK_DRIVER: DriverProfile = {
  id: 'DRV-102',
  name: 'Juan Dela Cruz',
  email: 'driver.juan@trivora.com',
  mobile: '+63 917 888 9999',
  plateNumber: 'TRV-102',
  toda: 'TODA Zone 1 - Poblacion, Nasugbu',
  rating: 4.9,
  totalTrips: 342,
  isOnline: true,
};

export const MOCK_BOOKING_REQUEST: BookingRequest = {
  id: 'BOOK-8821',
  passenger: {
    id: 'PSG-501',
    name: 'Maria Santos',
    rating: 4.85,
    mobile: '+63 918 123 4567',
    totalRides: 48,
  },
  pickupLocation: 'Nasugbu Town Plaza, Brgy. Poblacion',
  pickupCoords: { latitude: 14.064218, longitude: 120.622139 },
  destination: 'Wawa Beach Resort, Brgy. Wawa',
  destinationCoords: { latitude: 14.072510, longitude: 120.612044 },
  fare: '₱65',
  distance: '2.4 km',
  eta: '8 mins',
  notes: 'Near the green gate, carrying one heavy bag.',
  createdAt: '2 mins ago',
  status: 'pending',
};

export const MOCK_QUICK_STATS: QuickStats = {
  todayEarnings: '₱850.00',
  completedTrips: 12,
  acceptanceRate: '96%',
  driverRating: 4.9,
};

export const MOCK_RECENT_TRIP: TripHistoryItem = {
  id: 'TRIP-9901',
  date: 'Today, 11:30 AM',
  passengerName: 'Carlos Mendoza',
  pickup: 'Batangas State University - Nasugbu',
  destination: 'Nasugbu Public Market',
  fare: '₱40.00',
  status: 'Completed',
};

export const MOCK_HISTORY: TripHistoryItem[] = [
  MOCK_RECENT_TRIP,
  {
    id: 'TRIP-9900',
    date: 'Today, 10:15 AM',
    passengerName: 'Ana Reyes',
    pickup: 'Central School, Brgy. 4',
    destination: 'Municipal Hall, Poblacion',
    fare: '₱35.00',
    status: 'Completed',
  },
  {
    id: 'TRIP-9899',
    date: 'Yesterday, 4:45 PM',
    passengerName: 'Mark Dizon',
    pickup: 'Savemore Market Nasugbu',
    destination: 'Bucana Bridge',
    fare: '₱50.00',
    status: 'Completed',
  },
  {
    id: 'TRIP-9898',
    date: 'Yesterday, 2:20 PM',
    passengerName: 'Elena Ramos',
    pickup: 'Kawayan Cove Entrance',
    destination: 'Town Plaza',
    fare: '₱90.00',
    status: 'Cancelled',
  },
  {
    id: 'TRIP-9897',
    date: '22 Jul 2026, 6:10 PM',
    passengerName: 'John Michael',
    pickup: 'Natipuan Beach',
    destination: 'Nasugbu Bus Terminal',
    fare: '₱120.00',
    status: 'Completed',
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'New Booking Request',
    message: 'Passenger Maria Santos requested a ride to Wawa Beach Resort.',
    time: '2 mins ago',
    type: 'booking',
    unread: true,
  },
  {
    id: 'NOTIF-2',
    title: 'Payment Received',
    message: 'Fare of ₱40.00 from Carlos Mendoza credited to your wallet.',
    time: '45 mins ago',
    type: 'payment',
    unread: false,
  },
  {
    id: 'NOTIF-3',
    title: 'Trip Completed',
    message: 'Trip TRIP-9900 completed successfully. Great job!',
    time: '2 hours ago',
    type: 'completed',
    unread: false,
  },
  {
    id: 'NOTIF-4',
    title: 'Passenger Cancelled',
    message: 'Elena Ramos cancelled the ride request for TRIP-9898.',
    time: 'Yesterday',
    type: 'cancellation',
    unread: false,
  },
];
