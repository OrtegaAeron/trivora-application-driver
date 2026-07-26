import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

interface IncomingBookingCardProps {
  hasRequest?: boolean;
}

export default function IncomingBookingCard({ hasRequest = true }: IncomingBookingCardProps) {
  const navigation = useNavigation<any>();
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [todaZoneName, setTodaZoneName] = useState<string>('TODA Zone');

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  useEffect(() => {
    let intervalId: any = null;
    const host = getHost();

    async function pollPendingRequests() {
      if (!hasRequest) return;

      try {
        const response = await fetch(`http://${host}:8000/api/v1/driver/bookings/pending`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        const text = await response.text();
        if (!text || text.trim().length === 0) {
          setActiveRequest(null);
          return;
        }
        const data = JSON.parse(text);

        if (data.requests && data.requests.length > 0) {
          const req = data.requests[0];
          setActiveRequest({
            id: req.id,
            bookingCode: req.booking_code,
            fare: `₱${parseFloat(req.fare_amount).toFixed(2)}`,
            distance: req.distance_km ? `${req.distance_km} km` : '2.5 km',
            eta: req.estimated_duration_mins ? `${req.estimated_duration_mins} mins` : '8 mins',
            pickupLocation: req.pickup_name,
            destination: req.dropoff_name,
            pickupCoords: {
              latitude: parseFloat(req.pickup_lat) || 14.0725,
              longitude: parseFloat(req.pickup_lng) || 120.6315,
            },
            dropoffCoords: {
              latitude: parseFloat(req.dropoff_lat) || 14.0685,
              longitude: parseFloat(req.dropoff_lng) || 120.6285,
            },
            passenger: {
              name: req.passenger?.user?.name || 'Maria Clara',
              rating: req.passenger?.rating || 5.0,
              totalRides: req.passenger?.total_rides || 0,
              mobile: req.passenger?.mobile_number || '09191234567',
            },
            todaName: req.toda_zone?.name || 'TODA Brgy. 8',
          });
          setTodaZoneName(req.toda_zone?.name || 'TODA Zone');
        } else {
          setActiveRequest(null);
        }
      } catch (e) {
        console.log('[Driver IncomingCard] Poll notice:', e);
      }
    }

    pollPendingRequests();
    intervalId = setInterval(pollPendingRequests, 3000);
    return () => clearInterval(intervalId);
  }, [hasRequest]);

  if (!hasRequest || !activeRequest) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="wifi-outline" size={28} color={COLORS.primary} />
        <Text style={styles.emptyText}>Waiting for incoming TODA booking requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.previewHeader}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>⚡ INCOMING REQUEST ({todaZoneName})</Text>
        </View>
        <Text style={styles.fareText}>{activeRequest.fare}</Text>
      </View>

      <View style={styles.passengerRow}>
        <Ionicons name="person-circle" size={40} color={COLORS.primary} />
        <View style={styles.passengerMeta}>
          <Text style={styles.passengerName}>{activeRequest.passenger.name}</Text>
          <Text style={styles.routeText} numberOfLines={1}>
            {activeRequest.pickupLocation} ➔ {activeRequest.destination}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('BookingRequest', { bookingRequest: activeRequest })}
      >
        <Image
          source={require('../assets/tricycle.png')}
          style={styles.tricycleIcon}
        />
        <Text style={styles.text}>VIEW BOOKING DETAILS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  tagBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  fareText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  passengerMeta: {
    marginLeft: 12,
    flex: 1,
  },

  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  routeText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 18,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
  },

  tricycleIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },

  emptyText: {
    color: COLORS.gray,
    fontSize: 15,
    marginTop: 8,
    fontWeight: '500',
  },
});
