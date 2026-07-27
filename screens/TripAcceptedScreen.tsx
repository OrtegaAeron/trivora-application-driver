import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';
import { useAuth } from '../services/AuthContext';

export default function TripAcceptedScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { driverProfile } = useAuth();

  const rawRequest = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;

  const request = {
    id: rawRequest.id,
    bookingCode: rawRequest.bookingCode || rawRequest.booking_code || 'BK-TRIVORA',
    fare: rawRequest.fare || (rawRequest.fare_amount ? `₱${parseFloat(rawRequest.fare_amount).toFixed(2)}` : '₱45.00'),
    distance: rawRequest.distance || (rawRequest.distance_km ? `${rawRequest.distance_km} km` : '2.5 km'),
    eta: rawRequest.eta || (rawRequest.estimated_duration_mins ? `${rawRequest.estimated_duration_mins} mins` : '8 mins'),
    pickupLocation: rawRequest.pickupLocation || rawRequest.pickup_name || 'Pickup Point',
    destination: rawRequest.destination || rawRequest.dropoff_name || 'Destination Point',
    pickupCoords: {
      latitude: parseFloat(rawRequest.pickupCoords?.latitude || rawRequest.pickup_lat) || 14.0725,
      longitude: parseFloat(rawRequest.pickupCoords?.longitude || rawRequest.pickup_lng) || 120.6315,
    },
    dropoffCoords: {
      latitude: parseFloat(rawRequest.dropoffCoords?.latitude || rawRequest.dropoff_lat) || 14.0685,
      longitude: parseFloat(rawRequest.dropoffCoords?.longitude || rawRequest.dropoff_lng) || 120.6285,
    },
    passenger: {
      name: rawRequest.passenger?.name || rawRequest.passenger?.user?.name || 'Passenger',
      rating: rawRequest.passenger?.rating || 5.0,
      totalRides: rawRequest.passenger?.totalRides || rawRequest.passenger?.total_rides || 0,
      mobile: rawRequest.passenger?.mobile || rawRequest.passenger?.mobile_number || '09191234567',
    },
    todaName: rawRequest.todaName || rawRequest.toda_zone?.name || 'TODA Coverage Zone',
  };

  const [tripStage, setTripStage] = useState<'accepted' | 'arrived' | 'in_transit' | 'completed'>('accepted');

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  const sendDriverLocation = async (lat: number, lng: number) => {
    const host = getHost();
    const driverId = driverProfile ? (driverProfile.id || '').replace('DRV-', '') : '';
    const apiUrls = [
      `http://${host}:8000/api/v1/driver/location?driver_id=${driverId}`,
      `http://192.168.254.204:8000/api/v1/driver/location?driver_id=${driverId}`,
    ];

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            driver_id: driverId,
            user_id: driverId,
            latitude: lat,
            longitude: lng,
            speed_kmh: 24.5,
            heading_deg: 180.0,
          }),
        });
        if (response.ok) break;
      } catch (e) {}
    }
  };

  useEffect(() => {
    let watchSub: any = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // Get immediate hardware GPS location fix
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          if (current && current.coords) {
            sendDriverLocation(current.coords.latitude, current.coords.longitude);
          }

          // Continuously track real hardware GPS position
          watchSub = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Highest,
              timeInterval: 3000,
              distanceInterval: 5,
            },
            (loc) => {
              if (loc && loc.coords) {
                sendDriverLocation(loc.coords.latitude, loc.coords.longitude);
              }
            }
          );
        }
      } catch (e) {}
    })();

    return () => {
      if (watchSub && watchSub.remove) {
        watchSub.remove();
      }
    };
  }, []);

  const updateStage = async (nextStage: 'arrived' | 'in_transit' | 'completed') => {
    const host = getHost();
    const bookingId = request.id || 1;

    const apiUrls = [
      `http://${host}:8000/api/v1/driver/bookings/${bookingId}/status`,
      `http://192.168.254.204:8000/api/v1/driver/bookings/${bookingId}/status`,
      `http://192.168.254.205:8000/api/v1/driver/bookings/${bookingId}/status`,
      `http://localhost:8000/api/v1/driver/bookings/${bookingId}/status`,
      `http://127.0.0.1:8000/api/v1/driver/bookings/${bookingId}/status`,
      `http://10.0.2.2:8000/api/v1/driver/bookings/${bookingId}/status`,
    ];

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: nextStage }),
        });
        if (response.ok) {
          console.log(`[Driver Stage] Updated booking status to ${nextStage} via API.`);
          break;
        }
      } catch (e) {
        console.log('Stage update notice:', e);
      }
    }

    if (nextStage === 'completed') {
      navigation.replace('Main');
    } else {
      setTripStage(nextStage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          {/* SUCCESS ICON */}
          <Ionicons
            name={tripStage === 'completed' ? 'checkmark-circle' : tripStage === 'in_transit' ? 'navigate' : 'location'}
            size={90}
            color={COLORS.primary}
            style={styles.icon}
          />

          <Text style={styles.title}>
            {tripStage === 'accepted' && 'Booking Accepted'}
            {tripStage === 'arrived' && 'Arrived at Pickup'}
            {tripStage === 'in_transit' && 'Trip In Progress'}
          </Text>
          <Text style={styles.subtitle}>
            {tripStage === 'accepted' && `Heading to pick up ${request.passenger.name}.`}
            {tripStage === 'arrived' && `Waiting for ${request.passenger.name} to board your tricycle.`}
            {tripStage === 'in_transit' && `Navigating to ${request.destination}.`}
          </Text>

          {/* CARD SUMMARY */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Passenger & Trip Details</Text>
            <View style={styles.passengerRow}>
              <Ionicons name="person-circle" size={48} color={COLORS.primary} />
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{request.passenger.name}</Text>
                <Text style={styles.passengerPhone}>{request.passenger.mobile}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <View style={styles.textMeta}>
                <Text style={styles.label}>Pickup Location</Text>
                <Text style={styles.value}>{request.pickupLocation}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="flag" size={20} color={COLORS.secondary} />
              <View style={styles.textMeta}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{request.destination}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="cash" size={20} color={COLORS.success} />
              <View style={styles.textMeta}>
                <Text style={styles.label}>Total Fare</Text>
                <Text style={styles.fareValue}>{request.fare}</Text>
              </View>
            </View>
          </View>

          {/* DYNAMIC PROGRESS BUTTONS */}
          {tripStage === 'accepted' && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => updateStage('arrived')}
            >
              <Ionicons name="location-sharp" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>I AM AT PICKUP LOCATION</Text>
            </TouchableOpacity>
          )}

          {tripStage === 'arrived' && (
            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: '#10B981' }]}
              onPress={() => updateStage('in_transit')}
            >
              <Ionicons name="navigate" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>START TRIP NAVIGATION</Text>
            </TouchableOpacity>
          )}

          {tripStage === 'in_transit' && (
            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => updateStage('completed')}
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>COMPLETE RIDE & COLLECT FARE</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('PassengerDetails', { bookingRequest: request })}
          >
            <Ionicons name="person" size={20} color={COLORS.primary} />
            <Text style={styles.detailsButtonText}>VIEW PASSENGER DETAILS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  icon: {
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  passengerDetails: {
    marginLeft: 12,
  },

  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  passengerPhone: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  textMeta: {
    marginLeft: 12,
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: COLORS.gray,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 2,
  },

  fareValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: 2,
  },

  trackButton: {
    width: '100%',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
    textAlign: 'center',
    flexShrink: 1,
  },

  detailsButton: {
    width: '100%',
    height: 55,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  detailsButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
