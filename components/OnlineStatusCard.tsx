import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

interface OnlineStatusCardProps {
  initialOnline?: boolean;
  onToggle?: (isOnline: boolean) => void;
}

export default function OnlineStatusCard({ initialOnline = true, onToggle }: OnlineStatusCardProps) {
  const [isOnline, setIsOnline] = useState(initialOnline);

  const handleToggle = (value: boolean) => {
    setIsOnline(value);
    if (onToggle) {
      onToggle(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#DCFCE7' : '#F3F4F6' }]}>
        <Ionicons
          name={isOnline ? 'radio-button-on' : 'radio-button-off'}
          size={28}
          color={isOnline ? COLORS.success : COLORS.gray}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>Driver Status</Text>
        <Text style={[styles.statusText, { color: isOnline ? COLORS.success : COLORS.gray }]}>
          {isOnline ? 'You are ONLINE' : 'You are OFFLINE'}
        </Text>
        <Text style={styles.subtext}>
          {isOnline ? 'Ready to receive ride bookings' : 'Go online to receive trip requests'}
        </Text>
      </View>

      <Switch
        value={isOnline}
        onValueChange={handleToggle}
        trackColor={{ false: COLORS.lightGray, true: '#86EFAC' }}
        thumbColor={isOnline ? COLORS.success : '#9CA3AF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },

  label: {
    color: COLORS.gray,
    fontSize: 13,
  },

  statusText: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: 'bold',
  },

  subtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
});
