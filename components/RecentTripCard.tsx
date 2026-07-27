import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

export default function RecentTripCard() {
  const navigation = useNavigation<any>();
  const { driverProfile } = useAuth();
  const [recentTrip, setRecentTrip] = useState<any>(null);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  useEffect(() => {
    async function fetchRecentTrip() {
      try {
        const host = getHost();
        const driverId = driverProfile ? (driverProfile.id || '').replace('DRV-', '') : '';
        const url = driverId
          ? `http://${host}:8000/api/v1/driver/bookings/history?driver_id=${driverId}`
          : `http://${host}:8000/api/v1/driver/bookings/history`;

        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        if (data.bookings && data.bookings.length > 0) {
          setRecentTrip(data.bookings[0]);
        }
      } catch (e) {}
    }
    fetchRecentTrip();
  }, [driverProfile]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Most Recent Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.viewAll}>See History</Text>
        </TouchableOpacity>
      </View>

      {recentTrip ? (
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Image
              source={require('../assets/tricycle.png')}
              style={styles.icon}
            />
            <View style={styles.meta}>
              <Text style={styles.passenger}>{recentTrip.passenger?.user?.name || 'Passenger'}</Text>
              <Text style={styles.date}>{new Date(recentTrip.updated_at || recentTrip.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <Text style={styles.fare}>₱{recentTrip.fare_amount || '45.00'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {recentTrip.pickup_name || 'Pickup Point'}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="flag-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {recentTrip.dropoff_name || 'Destination'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="time-outline" size={32} color="#94A3B8" />
          <Text style={styles.emptyText}>No recent completed trips recorded yet.</Text>
        </View>
      )}
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

  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 32,
    height: 32,
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },

  meta: {
    flex: 1,
    marginLeft: 12,
  },

  passenger: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  date: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
