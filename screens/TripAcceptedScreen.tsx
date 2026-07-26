import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function TripAcceptedScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const request = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;
  const [tripStage, setTripStage] = useState<'accepted' | 'arrived' | 'in_transit' | 'completed'>('accepted');

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  const updateStage = async (nextStage: 'arrived' | 'in_transit' | 'completed') => {
    try {
      const host = getHost();
      const bookingId = request.id || 1;
      await fetch(`http://${host}:8000/api/v1/driver/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ status: nextStage }),
      });
    } catch (e) {
      console.log('Stage update notice:', e);
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
            {tripStage === 'accepted' && 'Booking Accepted!'}
            {tripStage === 'arrived' && 'Arrived at Pickup!'}
            {tripStage === 'in_transit' && 'Trip In Progress 🚀'}
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
              <Ionicons name="location-sharp" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>I'M AT THE PICKUP LOCATION 📍</Text>
            </TouchableOpacity>
          )}

          {tripStage === 'arrived' && (
            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: '#10B981' }]}
              onPress={() => updateStage('in_transit')}
            >
              <Ionicons name="navigate" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>START TRIP NAVIGATION 🚀</Text>
            </TouchableOpacity>
          )}

          {tripStage === 'in_transit' && (
            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: '#059669' }]}
              onPress={() => updateStage('completed')}
            >
              <Ionicons name="checkmark-done-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>COMPLETE RIDE & COLLECT FARE 🏁</Text>
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
    height: 58,
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
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
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
