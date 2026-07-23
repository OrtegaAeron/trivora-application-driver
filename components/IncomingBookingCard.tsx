import React from 'react';
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
import { MOCK_BOOKING_REQUEST } from '../services/api';

interface IncomingBookingCardProps {
  hasRequest?: boolean;
}

export default function IncomingBookingCard({ hasRequest = true }: IncomingBookingCardProps) {
  const navigation = useNavigation<any>();

  if (!hasRequest) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="wifi-outline" size={28} color={COLORS.gray} />
        <Text style={styles.emptyText}>Waiting for incoming booking requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.previewHeader}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>⚡ INCOMING REQUEST</Text>
        </View>
        <Text style={styles.fareText}>{MOCK_BOOKING_REQUEST.fare}</Text>
      </View>

      <View style={styles.passengerRow}>
        <Ionicons name="person-circle" size={40} color={COLORS.primary} />
        <View style={styles.passengerMeta}>
          <Text style={styles.passengerName}>{MOCK_BOOKING_REQUEST.passenger.name}</Text>
          <Text style={styles.routeText}>
            {MOCK_BOOKING_REQUEST.pickupLocation} ➔ {MOCK_BOOKING_REQUEST.destination}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('BookingRequest')}
      >
        <Image
          source={require('../assets/tricycle.png')}
          style={styles.tricycleIcon}
        />
        <Text style={styles.text}>NEW BOOKING REQUEST</Text>
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
