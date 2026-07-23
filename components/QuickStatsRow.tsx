import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_QUICK_STATS } from '../services/api';

export default function QuickStatsRow() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Summary</Text>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.success} />
          </View>
          <Text style={styles.statValue}>{MOCK_QUICK_STATS.todayEarnings}</Text>
          <Text style={styles.statLabel}>Earnings Today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{MOCK_QUICK_STATS.completedTrips}</Text>
          <Text style={styles.statLabel}>Trips Done</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star" size={22} color={COLORS.warning} />
          </View>
          <Text style={styles.statValue}>⭐ {MOCK_QUICK_STATS.driverRating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBg, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="checkmark-done" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.statValue}>{MOCK_QUICK_STATS.acceptanceRate}</Text>
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
