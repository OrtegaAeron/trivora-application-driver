import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const host = getHost();
        const list: any[] = [];

        // 1. Pending Incoming Requests
        try {
          const pendingRes = await fetch(`http://${host}:8000/api/v1/driver/bookings/pending`, {
            headers: { 'Accept': 'application/json' },
          });
          const pendingData = await pendingRes.json();
          if (pendingData.requests && pendingData.requests.length > 0) {
            pendingData.requests.forEach((req: any, idx: number) => {
              const fare = `₱${parseFloat(req.fare_amount || 0).toFixed(2)}`;
              const passName = req.passenger?.user?.name || req.passenger_name || 'Passenger';
              list.push({
                id: `pend-${req.id}-${idx}`,
                type: 'booking',
                title: 'Incoming Ride Request',
                message: `${passName} requested a ride near ${req.pickup_name || 'your area'}. Estimated Fare: ${fare}.`,
                time: 'Live',
                unread: true,
              });
            });
          }
        } catch (err) {}

        // 2. Active Trip Stage Notifications
        try {
          const activeRes = await fetch(`http://${host}:8000/api/v1/driver/bookings/active`, {
            headers: { 'Accept': 'application/json' },
          });
          const activeData = await activeRes.json();
          if (activeData.booking) {
            const b = activeData.booking;
            const passName = b.passenger?.user?.name || 'Passenger';
            const fare = `₱${parseFloat(b.fare_amount || 0).toFixed(2)}`;
            const code = b.booking_code || `#${b.id}`;

            if (b.status === 'accepted') {
              list.push({
                id: `dact-${b.id}-acc`,
                type: 'booking',
                title: 'Booking Accepted',
                message: `You accepted booking ${code}. Heading to pick up ${passName} at ${b.pickup_name || 'Pickup Point'}.`,
                time: 'Live',
                unread: true,
              });
            } else if (b.status === 'arrived') {
              list.push({
                id: `dact-${b.id}-arr`,
                type: 'completed',
                title: 'Arrived at Pickup Location',
                message: `You arrived at ${b.pickup_name || 'Pickup'}. Waiting for ${passName} to board.`,
                time: 'Live',
                unread: true,
              });
            } else if (b.status === 'in_transit') {
              list.push({
                id: `dact-${b.id}-trans`,
                type: 'booking',
                title: 'Trip in Progress',
                message: `Navigating to ${b.dropoff_name || 'Destination'}. Collect ${fare} upon arrival.`,
                time: 'Live',
                unread: true,
              });
            }
          }
        } catch (err) {}

        // 3. Completed Trip History Notifications
        try {
          const histRes = await fetch(`http://${host}:8000/api/v1/driver/bookings/history`, {
            headers: { 'Accept': 'application/json' },
          });
          const histData = await histRes.json();
          const rawHistory = histData.bookings || histData.history || [];

          rawHistory.slice(0, 10).forEach((b: any) => {
            const dateStr = b.created_at || b.requested_at
              ? new Date(b.created_at || b.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Recent';
            const fare = `₱${parseFloat(b.fare_amount || 0).toFixed(2)}`;
            const code = b.booking_code || `#${b.id}`;

            if (b.status === 'completed') {
              list.push({
                id: `dhist-${b.id}-comp`,
                type: 'payment',
                title: 'Fare Collected & Trip Completed',
                message: `Successfully completed trip ${code}. Earned ${fare} for ride to ${b.dropoff_name || 'Destination'}.`,
                time: dateStr,
                unread: false,
              });
            }
          });
        } catch (err) {}

        // 4. Driver Telematics & System Dispatch Alerts
        list.push({
          id: 'sys-1',
          type: 'completed',
          title: 'TODA Terminal Telematics Active',
          message: 'TODA Dispatch system is online and broadcasting real-time GPS telemetry.',
          time: 'System',
          unread: false,
        });

        setNotifications(list);
      } catch (e) {
        console.log('[Driver Notifications] Poll notice:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'booking':
        return { icon: 'car-sport', color: COLORS.primary, bg: '#EEF2FF' };
      case 'payment':
        return { icon: 'wallet', color: COLORS.success, bg: '#DCFCE7' };
      case 'completed':
        return { icon: 'checkmark-circle', color: COLORS.secondary, bg: '#E0E7FF' };
      case 'cancellation':
        return { icon: 'close-circle', color: COLORS.danger, bg: '#FEE2E2' };
      default:
        return { icon: 'notifications', color: COLORS.gray, bg: '#F3F4F6' };
    }
  };

  const markAllRead = () => {
    setNotifications((prev: any[]) =>
      prev.map((item: any) => ({ ...item, unread: false }))
    );
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const iconConfig = getIconConfig(item.type);

    return (
      <View style={[styles.card, item.unread && styles.unreadCard]}>
        <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
          <Ionicons name={iconConfig.icon as any} size={24} color={iconConfig.color} />
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>Driver Updates & Alerts</Text>
        </View>

        <TouchableOpacity onPress={markAllRead} style={styles.markReadButton}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
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

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerSub: {
    fontSize: 13,
    color: COLORS.lightGray,
    marginTop: 2,
  },

  markReadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  markReadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  listContent: {
    padding: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
  },

  time: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 8,
  },

  message: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
    lineHeight: 20,
  },
});
