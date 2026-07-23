import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function MapPreview() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Zone Map</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <Text style={styles.viewFull}>Expand Map ➔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mapBox}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Map')}
      >
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={COLORS.primary} />
          <Text style={styles.mapText}>Nasugbu Coverage Area Active</Text>
          <View style={styles.livePulse}>
            <View style={styles.dot} />
            <Text style={styles.pulseText}>GPS Signal Strong</Text>
          </View>
        </View>
      </TouchableOpacity>
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

  viewFull: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  mapBox: {
    height: 150,
    backgroundColor: '#EBF3FE',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0E1FD',
    elevation: 4,
  },

  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  livePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  pulseText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
});
