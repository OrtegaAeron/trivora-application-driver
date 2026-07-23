import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function TripSummaryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const booking = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          {/* SUCCESS BANNER */}
          <Ionicons
            name="checkmark-circle"
            size={90}
            color={COLORS.success}
            style={styles.icon}
          />
          <Text style={styles.title}>Trip Completed!</Text>
          <Text style={styles.subtitle}>
            Great job! You have safely completed the ride.
          </Text>

          {/* FARE & SUMMARY CARD */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardHeader}>Total Earnings</Text>
            <Text style={styles.fareAmount}>{booking.fare}</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance Covered</Text>
              <Text style={styles.detailValue}>{booking.distance}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>Cash / Wallet</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trip ID</Text>
              <Text style={styles.detailValue}>{booking.id}</Text>
            </View>
          </View>

          {/* PASSENGER CARD */}
          <View style={styles.passengerCard}>
            <Text style={styles.cardHeader}>Passenger Information</Text>
            <View style={styles.passengerRow}>
              <Ionicons name="person-circle" size={45} color={COLORS.primary} />
              <View style={styles.passengerMeta}>
                <Text style={styles.passengerName}>{booking.passenger.name}</Text>
                <Text style={styles.passengerRating}>⭐ {booking.passenger.rating} Rating</Text>
              </View>
            </View>
          </View>

          {/* BUTTONS */}
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => navigation.navigate('RatePassenger', { passenger: booking.passenger })}
          >
            <Ionicons name="star" size={22} color="#FFFFFF" />
            <Text style={styles.rateButtonText}>RATE PASSENGER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          >
            <Ionicons name="home" size={20} color={COLORS.primary} />
            <Text style={styles.dashboardButtonText}>BACK TO DASHBOARD</Text>
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
    marginBottom: 10,
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
    marginTop: 6,
    marginBottom: 20,
  },

  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.gray,
  },

  fareAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.success,
    marginVertical: 6,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 14,
  },

  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },

  passengerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 25,
    elevation: 4,
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  passengerMeta: {
    marginLeft: 12,
  },

  passengerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  passengerRating: {
    fontSize: 13,
    color: '#F4B400',
    fontWeight: '600',
    marginTop: 2,
  },

  rateButton: {
    width: '100%',
    height: 58,
    backgroundColor: COLORS.warning,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 12,
  },

  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  dashboardButton: {
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

  dashboardButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
