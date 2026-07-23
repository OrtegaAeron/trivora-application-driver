import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function PassengerDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const booking = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* PASSENGER PROFILE CARD */}
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person-circle" size={100} color={COLORS.primary} />
          </View>

          <Text style={styles.name}>{booking.passenger.name}</Text>
          <Text style={styles.rating}>⭐ {booking.passenger.rating} Rating</Text>
          <Text style={styles.rides}>{booking.passenger.totalRides} Trips Completed</Text>

          <View style={styles.divider} />

          {/* CONTACT & LOCATION META */}
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={22} color={COLORS.primary} />
            <Text style={styles.metaText}>{booking.passenger.mobile}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={22} color={COLORS.primary} />
            <Text style={styles.metaText}>{booking.pickupLocation}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="flag-outline" size={22} color={COLORS.secondary} />
            <Text style={styles.metaText}>{booking.destination}</Text>
          </View>

          {booking.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesHeader}>Passenger Note:</Text>
              <Text style={styles.notesBody}>"{booking.notes}"</Text>
            </View>
          )}

          {/* THREE MAIN BUTTONS WITH EXACT COLOR SCHEME */}
          <View style={styles.buttonGroup}>
            {/* CALL - SUCCESS GREEN */}
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Alert.alert('Call Passenger', `Calling ${booking.passenger.name} (${booking.passenger.mobile})...`)}
            >
              <Ionicons name="call" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Call Passenger</Text>
            </TouchableOpacity>

            {/* MESSAGE - PRIMARY NAVY */}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => Alert.alert('Message Passenger', 'Opening chat...')}
            >
              <Ionicons name="chatbubble" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Send Message</Text>
            </TouchableOpacity>

            {/* TRACKING - WARNING AMBER */}
            <TouchableOpacity
              style={styles.trackingButton}
              onPress={() => navigation.navigate('ActiveTrip', { bookingRequest: booking })}
            >
              <Ionicons name="navigate-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Start Live Tracking</Text>
            </TouchableOpacity>
          </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  scroll: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  avatarWrapper: {
    marginBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  rating: {
    fontSize: 16,
    color: '#F4B400',
    fontWeight: '600',
    marginTop: 4,
  },

  rides: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 20,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 10,
  },

  metaText: {
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '500',
  },

  notesContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  notesHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  notesBody: {
    fontSize: 14,
    color: COLORS.black,
    fontStyle: 'italic',
    marginTop: 4,
  },

  buttonGroup: {
    width: '100%',
    marginTop: 20,
  },

  callButton: {
    height: 55,
    backgroundColor: COLORS.success,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 12,
  },

  messageButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 12,
  },

  trackingButton: {
    height: 55,
    backgroundColor: COLORS.warning,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
