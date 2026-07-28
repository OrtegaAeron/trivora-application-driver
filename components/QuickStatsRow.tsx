import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

import { useAuth } from '../services/AuthContext';

export default function QuickStatsRow() {
  const { driverProfile } = useAuth();
  const [stats, setStats] = useState({
    todayEarnings: '₱0.00',
    completedTrips: 0,
    driverRating: 5.0,
    acceptanceRate: '100%',
  });

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '172.20.10.2';
  };

  useEffect(() => {
    async function fetchStats() {
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
        if (data.bookings) {
          const completed = data.bookings.filter((b: any) => b.status === 'completed');
          let todaySum = 0;
          let todayTripsCount = 0;
          const todayStr = new Date().toDateString();

          completed.forEach((b: any) => {
            if (new Date(b.created_at || b.requested_at).toDateString() === todayStr) {
              todaySum += parseFloat(b.fare_amount || 0);
              todayTripsCount += 1;
            }
          });

          const getRatingScore = (b: any) => {
            const r = Array.isArray(b.rating) ? b.rating[0] : b.rating;
            return r?.score ? Number(r.score) : null;
          };

          let avgRating = driverProfile?.rating || 5.0;
          const ratedBookings = completed.filter((b: any) => getRatingScore(b) !== null);
          if (ratedBookings.length > 0) {
            const sumRating = ratedBookings.reduce((acc: number, b: any) => acc + (getRatingScore(b) || 0), 0);
            avgRating = roundTo(sumRating / ratedBookings.length, 1);
          }

          setStats({
            todayEarnings: `₱${todaySum.toFixed(2)}`,
            completedTrips: todayTripsCount,
            driverRating: avgRating,
            acceptanceRate: '100%',
          });
        }
      } catch (e) {}
    }

    function roundTo(num: number, decimals: number) {
      const factor = Math.pow(10, decimals);
      return Math.round(num * factor) / factor;
    }

    fetchStats();
  }, [driverProfile]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Summary</Text>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.success} />
          </View>
          <Text style={styles.statValue}>{stats.todayEarnings}</Text>
          <Text style={styles.statLabel}>Earnings Today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{stats.completedTrips}</Text>
          <Text style={styles.statLabel}>Trips Done</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star" size={22} color={COLORS.warning} />
          </View>
          <Text style={styles.statValue}>{stats.driverRating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="checkmark-done" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.statValue}>{stats.acceptanceRate}</Text>
          <Text style={styles.statLabel}>Acceptance</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  statLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
  },
});
