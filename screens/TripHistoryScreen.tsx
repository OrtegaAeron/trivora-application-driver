import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

export default function TripHistoryScreen() {
  const navigation = useNavigation<any>();
  const { driverProfile } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '172.20.10.2';
  };

  useEffect(() => {
    async function fetchHistory() {
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
        const list = data.bookings || data.history || [];
        setHistory(list);
      } catch (e) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [driverProfile]);

  const renderItem = ({ item }: { item: any }) => {
    const ratingObj = Array.isArray(item.rating) ? item.rating[0] : item.rating;
    const ratingScore = ratingObj?.score ? Number(ratingObj.score) : null;
    return (
      <View style={styles.card}>
        {/* CARD TOP ROW */}
        <View style={styles.topRow}>
          <Image
            source={require('../assets/tricycle.png')}
            style={styles.tricycleIcon}
          />
          <View style={styles.meta}>
            <Text style={styles.passengerName}>{item.passenger?.user?.name || 'Passenger'}</Text>
            <Text style={styles.date}>{new Date(item.created_at || item.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.fare}>₱{item.fare_amount ? parseFloat(item.fare_amount).toFixed(2) : '45.00'}</Text>
            {ratingScore ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#B45309', marginLeft: 3 }}>
                  {ratingScore.toFixed(1)}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>No Rating</Text>
            )}
          </View>
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
                  item.status?.toLowerCase() === 'completed' || item.status?.toLowerCase() === 'accepted' ? '#DCFCE7' : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status?.toLowerCase() === 'completed' || item.status?.toLowerCase() === 'accepted' ? COLORS.success : COLORS.danger,
                },
              ]}
            >
              {item.status ? item.status.toUpperCase() : 'COMPLETED'}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History</Text>
      </View>

      {/* LIST */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading trip history...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBadge}>
            <Ionicons name="receipt-outline" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Completed Trips Yet</Text>
          <Text style={styles.emptySub}>Your completed TODA passenger dispatches will appear here after your first ride.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 60,
  },
  emptyIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
  },
});
