import React from 'react';
import {
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

export default function BookingRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const request = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;

  const handleAccept = () => {
    navigation.navigate('TripAccepted', { bookingRequest: request });
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Booking Declined', 'The request has been passed to nearby drivers.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Booking Request</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PASSENGER CARD */}
        <View style={styles.passengerCard}>
          <Ionicons name="person-circle" size={70} color={COLORS.primary} />
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{request.passenger.name}</Text>
            <Text style={styles.passengerRating}>⭐ {request.passenger.rating} Rating</Text>
            <Text style={styles.ridesCount}>{request.passenger.totalRides} completed rides</Text>
          </View>
        </View>

        {/* TRIP DETAILS CARD */}
        <View style={styles.tripCard}>
          <Text style={styles.cardTitle}>Trip Details</Text>

          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationText}>{request.pickupLocation}</Text>
              </View>
            </View>

            <View style={styles.lineConnector} />

            <View style={styles.locationRow}>
              <Ionicons name="flag" size={24} color={COLORS.secondary} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationText}>{request.destination}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{request.distance}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Est. Time</Text>
              <Text style={styles.infoValue}>{request.eta}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Fare Amount</Text>
              <Text style={styles.fareValue}>{request.fare}</Text>
            </View>
          </View>

          {request.notes && (
            <View style={styles.notesBox}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.notesText}>Note: {request.notes}</Text>
            </View>
          )}
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Alert.alert('Call Passenger', `Calling ${request.passenger.name} (${request.passenger.mobile})...`)}
          >
            <Ionicons name="call" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => Alert.alert('Message Passenger', 'Opening chat screen...')}
          >
            <Ionicons name="chatbubble" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM & DECLINE BUTTONS */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleAccept}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Accept Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleDecline}
        >
          <Ionicons name="close-circle" size={22} color={COLORS.danger} />
          <Text style={styles.cancelButtonText}>Decline Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  passengerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },

  passengerInfo: {
    marginLeft: 15,
    flex: 1,
  },

  passengerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  passengerRating: {
    fontSize: 15,
    color: '#F4B400',
    fontWeight: '600',
    marginTop: 4,
  },

  ridesCount: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },

  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  locationContainer: {
    marginBottom: 20,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  locationLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },

  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 2,
  },

  lineConnector: {
    width: 2,
    height: 25,
    backgroundColor: COLORS.border,
    marginLeft: 11,
    marginVertical: 4,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },

  fareValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: 4,
  },

  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  notesText: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
  },

  actionContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  callButton: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.success,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
    elevation: 5,
  },

  messageButton: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    elevation: 5,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  confirmButton: {
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 12,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  cancelButton: {
    height: 55,
    borderWidth: 2,
    borderColor: COLORS.danger,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  cancelButtonText: {
    color: COLORS.danger,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
