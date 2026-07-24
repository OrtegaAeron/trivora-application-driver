import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
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
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Locating Driver Position...</Text>
      </View>
    );
  }

  const driverLat  = location.latitude;
  const driverLng  = location.longitude;
  const pickupLat  = MOCK_BOOKING_REQUEST.pickupCoords.latitude;
  const pickupLng  = MOCK_BOOKING_REQUEST.pickupCoords.longitude;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; background: #e8eaed; }

  /* ── Attribution small */
  .leaflet-control-attribution {
    font-size: 8px !important;
    background: rgba(255,255,255,0.7) !important;
    padding: 1px 4px !important;
  }

  /* ── Custom driver marker */
  .driver-marker {
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 3px 6px rgba(30,42,90,0.3));
  }

  /* ── Custom pickup marker */
  .pickup-marker {
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 3px 6px rgba(34,197,94,0.35));
  }

  /* ── Popup */
  .leaflet-popup-content-wrapper {
    border-radius: 14px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
    font-family: -apple-system, sans-serif;
  }
  .leaflet-popup-content { margin: 10px 14px !important; }
  .popup-title { font-size: 13px; font-weight: 700; color: #1E2A5A; }
  .popup-sub   { font-size: 11px; color: #6B7280; margin-top: 2px; }

  /* ── Zoom controls custom position */
  .leaflet-control-zoom { border: none !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.14) !important; }
  .leaflet-control-zoom a { background: #FFFFFF !important; color: #1E2A5A !important; font-weight: bold; font-size: 18px; line-height: 36px !important; width: 36px !important; height: 36px !important; }
  .leaflet-control-zoom a:hover { background: #F0F4FF !important; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  // ── Map init with Carto Voyager (Google-Maps-like light style)
  var map = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView([${driverLat}, ${driverLng}], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // ── Zoom control bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // ── Coverage zone gradient circle
  L.circle([${driverLat}, ${driverLng}], {
    color: '#4F46E5',
    fillColor: '#6366F1',
    fillOpacity: 0.08,
    weight: 1.5,
    dashArray: '6 4',
    radius: 1200
  }).addTo(map);

  // ── Route polyline (driver → pickup) dashed
  var routeLine = L.polyline(
    [[${driverLat}, ${driverLng}], [${pickupLat}, ${pickupLng}]],
    {
      color: '#4F46E5',
      weight: 5,
      opacity: 0.85,
      dashArray: '12 8',
      lineCap: 'round'
    }
  ).addTo(map);

  // ── Tricycle base64 image asset from assets/tricycle.png
  var tricycleBase64 = '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';

  // ── Driver marker (Tricycle icon from assets with white round background)
  var driverIcon = L.divIcon({
    className: '',
    html: '<div style="width:42px; height:42px; background:#FFFFFF; border:2.5px solid #1E2A5A; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(30,42,90,0.25);"><img src="data:image/png;base64,' + tricycleBase64 + '" style="width:24px; height:24px; object-fit:contain;" /></div>',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22]
  });
  L.marker([${driverLat}, ${driverLng}], { icon: driverIcon })
    .addTo(map)
    .bindPopup('<div class="popup-title">🚗 Driver — TRV-102</div><div class="popup-sub">Juan Dela Cruz • Online</div>')
    .openPopup();

  // ── Simple Pickup pin marker SVG
  var pickupIcon = L.divIcon({
    className: '',
    html: '<div class="pickup-marker"><svg width="26" height="32" viewBox="0 0 26 32" fill="none"><path d="M13 0C5.82 0 0 5.82 0 13C0 22.75 13 32 13 32C13 32 26 22.75 26 13C26 5.82 20.18 0 13 0Z" fill="#22C55E"/><circle cx="13" cy="12" r="5" fill="#FFFFFF"/></svg></div>',
    iconSize: [26, 32],
    iconAnchor: [13, 32],
    popupAnchor: [0, -32]
  });
  L.marker([${pickupLat}, ${pickupLng}], { icon: pickupIcon })
    .addTo(map)
    .bindPopup('<div class="popup-title">📍 Passenger Pickup</div><div class="popup-sub">Maria Santos • Waiting</div>');

  // ── Fit both markers with padding
  map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
</script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      {/* ── Full-screen map */}
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
      />

      {/* ── Top search bar overlay (Google Maps style) */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.searchPill}>
          <Ionicons name="location" size={16} color={COLORS.secondary} />
          <Text style={styles.searchText} numberOfLines={1}>
            Nasugbu Coverage Zone · TRV-102
          </Text>
        </View>
      </View>

      {/* ── Floating map type button */}
      <View style={styles.sideControls}>
        <TouchableOpacity style={styles.sideBtn}>
          <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn}>
          <Ionicons name="locate" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Bottom card */}
      <View style={styles.bottomCard}>
        {/* Handle */}
        <View style={styles.handle} />

        <View style={styles.zoneRow}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.zoneTitle}>Nasugbu Zone 1 — Active Coverage</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Ionicons name="people-outline" size={14} color={COLORS.secondary} />
            <Text style={styles.statChipText}>1 Nearby Request</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="navigate-outline" size={14} color={COLORS.success} />
            <Text style={styles.statChipText}>GPS Strong</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="radio-outline" size={14} color={COLORS.warning} />
            <Text style={styles.statChipText}>1.2 km radius</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('BookingRequest')}
        >
          <View style={styles.actionBtnInner}>
            <View style={styles.actionBtnLeft}>
              <Text style={styles.actionBtnLabel}>Incoming Booking Request</Text>
              <Text style={styles.actionBtnPassenger}>Maria Santos · 2.4 km away</Text>
            </View>
            <View style={styles.fareBadge}>
              <Text style={styles.fareBadgeText}>₱65</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8EAED' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },

  map: { flex: 1 },

  // ── Top bar
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  searchPill: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  searchText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
    flex: 1,
  },

  // ── Side controls
  sideControls: {
    position: 'absolute',
    right: 16,
    bottom: 210,
    gap: 10,
  },
  sideBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 8,
  },

  // ── Bottom card
  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },

  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  zoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  statChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray,
  },

  // ── Action button
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnLeft: {
    flex: 1,
  },
  actionBtnLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionBtnPassenger: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  fareBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 4,
  },
  fareBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
