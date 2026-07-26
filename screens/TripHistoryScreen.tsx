import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function TripHistoryScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const host = getHost();
        const res = await fetch(`http://${host}:8000/api/v1/driver/bookings/history`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        const list = data.bookings || data.history || [];
        setHistory(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* CARD TOP ROW */}
      <View style={styles.topRow}>
        <Image
          source={require('../assets/tricycle.png')}
          style={styles.tricycleIcon}
        />
        <View style={styles.meta}>
          <Text style={styles.passengerName}>{item.passenger?.user?.name || 'Passenger'}</Text>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Text style={styles.fare}>₱{item.fare_amount || '45.00'}</Text>
      </View>

      <View style={styles.divider} />

      {/* PICKUP & DESTINATION */}
      <View style={styles.locationRow}>
        <Ionicons name="location" size={18} color={COLORS.primary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.pickup_name || 'Pickup Point'}
        </Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="flag" size={18} color={COLORS.secondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.dropoff_name || 'Destination'}
        </Text>
      </View>

      {/* FOOTER STATUS */}
      <View style={styles.footerRow}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'Completed' ? '#DCFCE7' : '#FEE2E2',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'Completed' ? COLORS.success : COLORS.danger,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.detailsLink}
          onPress={() => navigation.navigate('TripDetail', { trip: item })}
        >
          <Text style={styles.detailsLinkText}>Trip Details ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={history}
        keyExtractor={(item: TripHistoryItem) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  listContent: {
    padding: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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

  tricycleIcon: {
    width: 36,
    height: 36,
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },

  meta: {
    flex: 1,
    marginLeft: 12,
  },

  passengerName: {
    fontSize: 17,
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
    marginBottom: 8,
  },

  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  detailsLink: {
    paddingVertical: 4,
  },

  detailsLinkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
