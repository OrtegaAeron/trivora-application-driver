import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function MapScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    latitude: 14.064218,
    longitude: 120.622139,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to display live driver position.');
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch (e) {
      console.log('Location error:', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Locating Driver Position...</Text>
      </View>
    );
  }

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
var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

var driverMarker = L.marker([${location.latitude}, ${location.longitude}])
  .addTo(map)
  .bindPopup("Driver Live Location (TRV-102)")
  .openPopup();

var zoneCircle = L.circle([${location.latitude}, ${location.longitude}], {
  color: '#4F46E5',
  fillColor: '#6366F1',
  fillOpacity: 0.15,
  radius: 1200
}).addTo(map);

var requestMarker = L.marker([${MOCK_BOOKING_REQUEST.pickupCoords.latitude}, ${MOCK_BOOKING_REQUEST.pickupCoords.longitude}])
  .addTo(map)
  .bindPopup("Incoming Booking Request: Maria Santos");
</script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
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

        <Text style={styles.headerTitle}>Driver Live Zone Map</Text>
      </View>

      {/* BOTTOM ACTION OVERLAY */}
      <View style={styles.bottomCard}>
        <View style={styles.zoneHeader}>
          <Ionicons name="radio" size={24} color={COLORS.success} />
          <View style={styles.zoneMeta}>
            <Text style={styles.zoneTitle}>Active Coverage: Nasugbu Zone 1</Text>
            <Text style={styles.zoneSub}>1 Pending Booking Request Nearby</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('BookingRequest')}
        >
          <Ionicons name="car-sport" size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>VIEW BOOKING REQUEST (₱65)</Text>
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
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

  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  zoneMeta: {
    marginLeft: 12,
    flex: 1,
  },

  zoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  zoneSub: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },

  actionButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
