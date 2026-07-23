import React from 'react';
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
import { MOCK_RECENT_TRIP } from '../services/api';

export default function RecentTripCard() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Most Recent Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.viewAll}>See History ➔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <Image
            source={require('../assets/tricycle.png')}
            style={styles.icon}
          />
          <View style={styles.meta}>
            <Text style={styles.passenger}>{MOCK_RECENT_TRIP.passengerName}</Text>
            <Text style={styles.date}>{MOCK_RECENT_TRIP.date}</Text>
          </View>
          <Text style={styles.fare}>{MOCK_RECENT_TRIP.fare}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {MOCK_RECENT_TRIP.pickup}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="flag-outline" size={18} color={COLORS.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {MOCK_RECENT_TRIP.destination}
          </Text>
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
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
});
