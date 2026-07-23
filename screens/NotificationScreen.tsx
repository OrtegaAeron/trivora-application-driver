import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_NOTIFICATIONS } from '../services/api';
import { AppNotification } from '../types';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const getIconConfig = (type: AppNotification['type']) => {
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
    setNotifications((prev: AppNotification[]) =>
      prev.map((item: AppNotification) => ({ ...item, unread: false }))
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
