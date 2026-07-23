import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function ActiveTripScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const booking = route.params?.bookingRequest || MOCK_BOOKING_REQUEST;

  // Trip Status Stepper:
  // 0: "En Route to Pickup"
  // 1: "Arrived at Pickup"
  // 2: "Passenger Onboard"
  // 3: "Arrived at Destination" (Complete Trip)
  const [tripStep, setTripStep] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState('1.2 km');
  const [etaMinutes, setEtaMinutes] = useState(5);

  const statusTexts = [
    'En Route to Pickup Location',
    'Arrived at Pickup Location',
    'Passenger Onboard — Navigating to Destination',
    'Arrived at Destination',
  ];

  const primaryButtonTexts = [
    'Mark as "Arrived at Pickup"',
    'Start Ride with Passenger',
    'Complete Trip & Collect Fare',
    'Proceed to Trip Summary',
  ];

  useEffect(() => {
    let timer: any;
    if (tripStep === 0 && etaMinutes > 1) {
      timer = setInterval(() => {
        setEtaMinutes((prev) => {
          if (prev <= 1) {
            setDistanceRemaining('0 m');
            return 0;
          }
          return prev - 1;
        });
        setDistanceRemaining((prev) => {
          if (prev === '1.2 km') return '700 m';
          if (prev === '700 m') return '250 m';
          return '0 m';
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [tripStep, etaMinutes]);

  const handleNextStep = () => {
    if (tripStep < 2) {
      setTripStep((prev) => prev + 1);
      if (tripStep === 0) {
        setDistanceRemaining('0 m');
        setEtaMinutes(0);
      } else if (tripStep === 1) {
        setDistanceRemaining(booking.distance);
        setEtaMinutes(8);
      }
    } else {
      // Complete trip and navigate to summary
      navigation.navigate('TripSummary', { bookingRequest: booking });
    }
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
html, body, #map {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('map').setView([14.064218, 120.622139], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

var driverMarker = L.marker([14.064218, 120.622139]).addTo(map).bindPopup('Driver Location').openPopup();
var passengerMarker = L.marker([14.067000, 120.624000]).addTo(map).bindPopup('Passenger Pickup');
var destMarker = L.marker([14.072510, 120.612044]).addTo(map).bindPopup('Destination');
</script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      {/* MAP */}
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Trip Navigation</Text>
      </View>

      {/* BOTTOM CARD */}
      <View style={styles.bottomCard}>
        <Text style={styles.status}>{statusTexts[tripStep]}</Text>

        {/* PASSENGER ROW */}
        <View style={styles.passengerRow}>
          <Ionicons name="person-circle" size={60} color={COLORS.primary} />
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{booking.passenger.name}</Text>
            <Text style={styles.passengerContact}>{booking.passenger.mobile}</Text>
            <Text style={styles.passengerRating}>⭐ {booking.passenger.rating} Rating</Text>
          </View>
        </View>

        {/* INFO BOXES */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>ETA</Text>
            <Text style={styles.infoValue}>{etaMinutes} min</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="navigate" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Distance</Text>
            <Text style={styles.infoValue}>{distanceRemaining}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="cash" size={24} color={COLORS.success} />
            <Text style={styles.infoTitle}>Fare</Text>
            <Text style={styles.fareValue}>{booking.fare}</Text>
          </View>
        </View>

        {/* DESTINATION CARD */}
        <View style={styles.destinationCard}>
          <Ionicons name="location" size={22} color={COLORS.primary} />
          <Text style={styles.destinationText} numberOfLines={1}>
            {tripStep < 2 ? `Pickup: ${booking.pickupLocation}` : `Destination: ${booking.destination}`}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Alert.alert('Call Passenger', `Calling ${booking.passenger.name}...`)}
          >
            <Ionicons name="call" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => Alert.alert('Message Passenger', 'Opening chat...')}
          >
            <Ionicons name="chatbubble" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* STEPPER MAIN ACTION BUTTON */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={handleNextStep}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>{primaryButtonTexts[tripStep]}</Text>
        </TouchableOpacity>

        {/* CANCEL TRIP */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            Alert.alert(
              'Cancel Trip',
              'Are you sure you want to cancel this trip?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes, Cancel',
                  style: 'destructive',
                  onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] }),
                },
              ]
            )
          }
        >
          <Ionicons name="close-circle" size={22} color="#E53935" />
          <Text style={styles.cancelText}>Cancel Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  map: {
    flex: 1,
  },

  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  bottomCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  status: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  passengerInfo: {
    marginLeft: 15,
    flex: 1,
  },

  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  passengerContact: {
    marginTop: 2,
    fontSize: 14,
    color: COLORS.gray,
  },

  passengerRating: {
    marginTop: 2,
    fontSize: 14,
    color: '#F4B400',
    fontWeight: '600',
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    borderRadius: 15,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  infoTitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.gray,
  },

  infoValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  fareValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },

  destinationText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  callButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.success,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 6,
    elevation: 4,
  },

  messageButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 6,
    elevation: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  primaryActionButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 10,
  },

  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  cancelButton: {
    height: 50,
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  cancelText: {
    color: '#E53935',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
