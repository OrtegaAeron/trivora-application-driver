import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const { width } = Dimensions.get('window');

// ── Mock Data ──────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: 'Mon', amount: 320, trips: 4 },
  { day: 'Tue', amount: 510, trips: 7 },
  { day: 'Wed', amount: 280, trips: 3 },
  { day: 'Thu', amount: 640, trips: 9 },
  { day: 'Fri', amount: 780, trips: 11 },
  { day: 'Sat', amount: 920, trips: 13 },
  { day: 'Sun', amount: 450, trips: 6 },
];

const TODAY_INDEX = 5; // Saturday

const PAYOUTS = [
  { id: '1', date: 'Jul 21, 2026', amount: '₱ 1,840.00', status: 'Paid' },
  { id: '2', date: 'Jul 14, 2026', amount: '₱ 2,210.00', status: 'Paid' },
  { id: '3', date: 'Jul 7, 2026',  amount: '₱ 1,650.00', status: 'Paid' },
];

const MAX_AMOUNT = Math.max(...WEEKLY_DATA.map((d) => d.amount));
const BAR_MAX_HEIGHT = 80;

export default function EarningsScreen() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('weekly');

  const totalWeekly = WEEKLY_DATA.reduce((sum, d) => sum + d.amount, 0);
  const totalTrips   = WEEKLY_DATA.reduce((sum, d) => sum + d.trips, 0);
  const avgFare      = Math.round(totalWeekly / totalTrips);
  const todayEarnings = WEEKLY_DATA[TODAY_INDEX].amount;

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'daily' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.toggleText, activeTab === 'daily' && styles.toggleTextActive]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'weekly' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.toggleText, activeTab === 'weekly' && styles.toggleTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Today's Earnings Hero ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroInner}>
            <Text style={styles.heroLabel}>
              {activeTab === 'daily' ? "Today's Earnings" : 'This Week'}
            </Text>
            <Text style={styles.heroAmount}>
              ₱ {activeTab === 'daily'
                ? todayEarnings.toLocaleString()
                : totalWeekly.toLocaleString()}
              <Text style={styles.heroCents}>.00</Text>
            </Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Ionicons name="car" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>
                  {activeTab === 'daily'
                    ? `${WEEKLY_DATA[TODAY_INDEX].trips} trips`
                    : `${totalTrips} trips`}
                </Text>
              </View>
              <View style={styles.heroMetaDot} />
              <View style={styles.heroMetaItem}>
                <Ionicons name="trending-up" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>₱ {avgFare} avg fare</Text>
              </View>
            </View>
          </View>
          {/* Decorative circles */}
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />
        </View>

        {/* ── 7-Day Bar Chart ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.chartRow}>
            {WEEKLY_DATA.map((item, index) => {
              const barHeight = Math.max(
                (item.amount / MAX_AMOUNT) * BAR_MAX_HEIGHT,
                8,
              );
              const isToday = index === TODAY_INDEX;
              return (
                <View key={item.day} style={styles.barWrapper}>
                  <Text style={[styles.barAmount, isToday && styles.barAmountActive]}>
                    {item.amount >= 1000
                      ? `${(item.amount / 1000).toFixed(1)}k`
                      : item.amount}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { height: barHeight },
                        isToday && styles.barActive,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, isToday && styles.barDayActive]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Quick Stats ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { marginRight: 8 }]}>
            <View style={[styles.statIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="car-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.statValue}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>

          <View style={[styles.statCard, { marginHorizontal: 4 }]}>
            <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="cash-outline" size={20} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>₱ {avgFare}</Text>
            <Text style={styles.statLabel}>Avg Fare</Text>
          </View>

          <View style={[styles.statCard, { marginLeft: 8 }]}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="time-outline" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.statValue}>38 hrs</Text>
            <Text style={styles.statLabel}>Online Time</Text>
          </View>
        </View>

        {/* ── Recent Payouts ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {PAYOUTS.map((payout, index) => (
            <View
              key={payout.id}
              style={[
                styles.payoutRow,
                index < PAYOUTS.length - 1 && styles.payoutDivider,
              ]}
            >
              <View style={styles.payoutIconWrap}>
                <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.payoutMeta}>
                <Text style={styles.payoutDate}>{payout.date}</Text>
                <Text style={styles.payoutAmount}>{payout.amount}</Text>
              </View>
              <View style={[
                styles.payoutBadge,
                { backgroundColor: payout.status === 'Paid' ? '#DCFCE7' : '#FEF3C7' },
              ]}>
                <Text style={[
                  styles.payoutBadgeText,
                  { color: payout.status === 'Paid' ? COLORS.success : COLORS.warning },
                ]}>
                  {payout.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Cash Out Button ── */}
        <TouchableOpacity style={styles.cashOutBtn} activeOpacity={0.85}>
          <Ionicons name="arrow-down-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.cashOutText}>Request Cash Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.primary,
  },

  scroll: {
    padding: 16,
    paddingBottom: 32,
  },

  // ── Hero Card
  heroCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroInner: {
    zIndex: 2,
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '500',
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 50,
  },
  heroCents: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 4,
  },
  heroMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 10,
  },
  heroBubble1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: -40,
    top: -40,
  },
  heroBubble2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: 20,
    bottom: -30,
  },

  // ── Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 16,
  },

  // ── Bar Chart
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barAmount: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  barAmountActive: {
    color: COLORS.secondary,
  },
  barTrack: {
    width: 22,
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 11,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 11,
  },
  barActive: {
    backgroundColor: COLORS.secondary,
  },
  barDay: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
    fontWeight: '500',
  },
  barDayActive: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },

  // ── Stats Row
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
    textAlign: 'center',
  },

  // ── Payouts
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  payoutDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  payoutIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  payoutMeta: {
    flex: 1,
  },
  payoutDate: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  payoutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payoutBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ── Cash Out Button
  cashOutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cashOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
