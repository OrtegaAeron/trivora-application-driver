import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function QuickStatsRow() {
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
    return '192.168.254.205';
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const host = getHost();
        const res = await fetch(`http://${host}:8000/api/v1/driver/bookings/history`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        if (data.bookings) {
          const completed = data.bookings.filter((b: any) => b.status === 'completed');
          let todaySum = 0;
          const todayStr = new Date().toDateString();

          completed.forEach((b: any) => {
            if (new Date(b.created_at || b.requested_at).toDateString() === todayStr) {
              todaySum += parseFloat(b.fare_amount || 0);
            }
          });

          setStats({
            todayEarnings: `₱${todaySum.toFixed(2)}`,
            completedTrips: completed.length,
            driverRating: 4.9,
            acceptanceRate: '100%',
          });
        }
      } catch (e) {}
    }
    fetchStats();
  }, []);

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
