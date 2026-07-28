import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';
import { useAuth } from '../services/AuthContext';

export default function BookingRequestScreen() {
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

  const pickupLat = request.pickupCoords.latitude;
  const pickupLng = request.pickupCoords.longitude;
  const dropoffLat = request.dropoffCoords.latitude;
  const dropoffLng = request.dropoffCoords.longitude;

  const mapHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #f8fafc; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', { zoomControl: false }).setView([${pickupLat}, ${pickupLng}], 14);
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
  }).addTo(map);

  var pickupMarker = L.marker([${pickupLat}, ${pickupLng}]).addTo(map).bindPopup('<b>Pickup Point</b>');
  var dropoffMarker = L.marker([${dropoffLat}, ${dropoffLng}]).addTo(map).bindPopup('<b>Pinned Destination</b>');

  var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + ${pickupLng} + ',' + ${pickupLat} + ';' + ${dropoffLng} + ',' + ${dropoffLat} + '?overview=full&geometries=geojson';

  fetch(osrmUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.routes && data.routes.length > 0) {
        var coords = data.routes[0].geometry.coordinates.map(function(c) {
          return [c[1], c[0]];
        });
        var routePolyline = L.polyline(coords, {
          color: '#2563EB',
          weight: 6,
          opacity: 0.9
        }).addTo(map);
        map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });
      } else {
        var fallbackLine = L.polyline([[${pickupLat}, ${pickupLng}], [${dropoffLat}, ${dropoffLng}]], {
          color: '#2563EB',
          weight: 5,
          dashArray: '6, 6'
        }).addTo(map);
        map.fitBounds(fallbackLine.getBounds(), { padding: [30, 30] });
      }
    })
    .catch(function(err) {
      var fallbackLine = L.polyline([[${pickupLat}, ${pickupLng}], [${dropoffLat}, ${dropoffLng}]], {
        color: '#2563EB',
        weight: 5,
        dashArray: '6, 6'
      }).addTo(map);
      map.fitBounds(fallbackLine.getBounds(), { padding: [30, 30] });
    });
</script>
</body>
</html>
`;

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '172.20.10.2';
  };

  const handleAccept = async () => {
    const host = getHost();
    const bookingId = request.id || 1;
    const driverId = driverProfile ? (driverProfile.id || driverProfile.user_id) : '';

    const apiUrls = [
      `http://${host}:8000/api/v1/driver/bookings/${bookingId}/accept`,
      `http://172.20.10.2:8000/api/v1/driver/bookings/${bookingId}/accept`,
      `http://192.168.254.205:8000/api/v1/driver/bookings/${bookingId}/accept`,
      `http://localhost:8000/api/v1/driver/bookings/${bookingId}/accept`,
      `http://127.0.0.1:8000/api/v1/driver/bookings/${bookingId}/accept`,
      `http://10.0.2.2:8000/api/v1/driver/bookings/${bookingId}/accept`,
    ];

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            driver_id: driverId,
            user_id: driverId,
          }),
        });
        if (response.ok) {
          console.log('[Driver Accept] Successfully updated booking status to accepted via API.');
          break;
        }
      } catch (e) {
        console.log('Driver Accept API Notice:', e);
      }
    }

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

        {/* ROUTE MAP PREVIEW */}
        <View style={styles.mapCard}>
          <Text style={styles.cardTitle}>Route Overview (Pickup ➔ Pinned Location)</Text>
          <View style={styles.mapFrame}>
            <WebView
              style={styles.webViewMap}
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  mapFrame: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden' as any,
    marginTop: 10,
  },
  webViewMap: {
    flex: 1,
  },
});
