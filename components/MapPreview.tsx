import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function MapPreview() {
  const navigation = useNavigation<any>();

  const [location, setLocation] = useState({
    latitude: 14.064218,
    longitude: 120.622139,
  });

  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          setLocation({
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          });
        }
      } catch (e) {}

      // Fetch active booking status
      try {
        const host = getHost();
        const res = await fetch(`http://${host}:8000/api/v1/driver/bookings/active`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        if (data.booking && ['pending', 'accepted', 'arrived', 'in_transit'].includes(data.booking.status)) {
          setActiveBooking(data.booking);
        } else {
          setActiveBooking(null);
        }
      } catch (err) {}
    })();
  }, []);

  const driverLat = location.latitude;
  const driverLng = location.longitude;

  const hasActiveBooking = !!(activeBooking && activeBooking.pickup_lat && activeBooking.pickup_lng);
  const pLat = hasActiveBooking ? parseFloat(activeBooking.pickup_lat) : 0;
  const pLng = hasActiveBooking ? parseFloat(activeBooking.pickup_lng) : 0;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; background: #e8eaed; overflow: hidden; }
  .leaflet-control-container { display: none !important; }

  /* ── Custom driver marker */
  .driver-marker {
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 2px 5px rgba(30,42,90,0.3));
  }

  /* ── Custom pickup marker */
  .pickup-marker {
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 2px 5px rgba(34,197,94,0.35));
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var hasActive = ${hasActiveBooking ? 'true' : 'false'};

  var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false
  }).setView([${driverLat}, ${driverLng}], 16);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
  }).addTo(map);

  // ── Tricycle base64 image asset from assets/tricycle.png
  var tricycleBase64 = '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';

  // ── Driver marker (Tricycle icon from assets with white round background)
  var driverIcon = L.divIcon({
    className: '',
    html: '<div style="width:34px; height:34px; background:#FFFFFF; border:2px solid #1E2A5A; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(30,42,90,0.22);"><img src="data:image/png;base64,' + tricycleBase64 + '" style="width:19px; height:19px; object-fit:contain;" /></div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
  L.marker([${driverLat}, ${driverLng}], { icon: driverIcon }).addTo(map);

  if (hasActive) {
    var pickupIcon = L.divIcon({
      className: '',
      html: '<div class="pickup-marker"><svg width="22" height="27" viewBox="0 0 26 32" fill="none"><path d="M13 0C5.82 0 0 5.82 0 13C0 22.75 13 32 13 32C13 32 26 22.75 26 13C26 5.82 20.18 0 13 0Z" fill="#22C55E"/><circle cx="13" cy="12" r="5" fill="#FFFFFF"/></svg></div>',
      iconSize: [22, 27],
      iconAnchor: [11, 27]
    });
    L.marker([${pLat}, ${pLng}], { icon: pickupIcon }).addTo(map);

    var routeLine = L.polyline(
      [[${driverLat}, ${driverLng}], [${pLat}, ${pLng}]],
      { color: '#4F46E5', weight: 4, opacity: 0.85, dashArray: '8 6', lineCap: 'round' }
    ).addTo(map);

    map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });
  }
</script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Zone Map</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <Text style={styles.viewFull}>Expand Map ➔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mapBox}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Map')}
      >
        <WebView
          style={styles.webView}
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          pointerEvents="none"
        />

        {/* Overlay Badges */}
        <View style={styles.overlayTopLeft}>
          <View style={styles.livePulse}>
            <View style={styles.dot} />
            <Text style={styles.pulseText}>LIVE COVERAGE</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  viewFull: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  mapBox: {
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D0E1FD',
    elevation: 5,
    shadowColor: '#1E2A5A',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: '#E8EAED',
    position: 'relative',
  },

  webView: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },

  overlayTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
  },

  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  pulseText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

