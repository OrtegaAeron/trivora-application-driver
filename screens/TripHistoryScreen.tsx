import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_HISTORY } from '../services/api';
import { TripHistoryItem } from '../types';

export default function TripHistoryScreen() {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<TripHistoryItem[]>(MOCK_HISTORY);

  const renderItem = ({ item }: { item: TripHistoryItem }) => (
    <View style={styles.card}>
      {/* CARD TOP ROW */}
      <View style={styles.topRow}>
        <Image
          source={require('../assets/tricycle.png')}
          style={styles.tricycleIcon}
        />
        <View style={styles.meta}>
          <Text style={styles.passengerName}>{item.passengerName}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.fare}>{item.fare}</Text>
      </View>

      <View style={styles.divider} />

      {/* PICKUP & DESTINATION */}
      <View style={styles.locationRow}>
        <Ionicons name="location" size={18} color={COLORS.primary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.pickup}
        </Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="flag" size={18} color={COLORS.secondary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.destination}
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
