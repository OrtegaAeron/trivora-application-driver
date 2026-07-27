import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { TripHistoryItem } from '../types';

// ── Enriched mock details per trip (distance, payment, rating)
const TRIP_EXTRAS: Record<string, { distance: string; payment: string; passengerRating: number; duration: string }> = {
  'TRIP-9901': { distance: '1.8 km', payment: 'Cash', passengerRating: 5.0, duration: '6 mins' },
  'TRIP-9900': { distance: '1.2 km', payment: 'Cash', passengerRating: 4.8, duration: '4 mins' },
  'TRIP-9899': { distance: '3.1 km', payment: 'Cash', passengerRating: 4.9, duration: '10 mins' },
  'TRIP-9898': { distance: '—',      payment: '—',    passengerRating: 0,   duration: '—' },
  'TRIP-9897': { distance: '5.6 km', payment: 'Cash', passengerRating: 5.0, duration: '18 mins' },
};

// ── Timeline steps
const COMPLETED_STEPS = [
  { label: 'Booking Accepted',    icon: 'checkmark-circle' as const },
  { label: 'En Route to Pickup',  icon: 'navigate'          as const },
  { label: 'Passenger On Board',  icon: 'person'            as const },
  { label: 'Trip Completed',      icon: 'flag'              as const },
];

const CANCELLED_STEPS = [
  { label: 'Booking Accepted',    icon: 'checkmark-circle' as const },
  { label: 'Passenger Cancelled', icon: 'close-circle'     as const },
];

export default function TripDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const rawTrip: any = route.params?.trip;

  if (!rawTrip) return null;

  const tripId = rawTrip.booking_code || rawTrip.bookingCode || rawTrip.id || 'BK-TRIP';
  const tripDate = rawTrip.created_at || rawTrip.requested_at
    ? new Date(rawTrip.created_at || rawTrip.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : (rawTrip.date || 'Today');
  const fareDisplay = rawTrip.fare_amount
    ? `₱${parseFloat(rawTrip.fare_amount).toFixed(2)}`
    : (rawTrip.fare || '₱45.00');
  const passengerName = rawTrip.passenger?.user?.name || rawTrip.passengerName || 'Passenger';
  const pickupLocation = rawTrip.pickup_name || rawTrip.pickup || 'Pickup Point';
  const dropoffLocation = rawTrip.dropoff_name || rawTrip.destination || 'Destination Point';
  const rawStatus = (rawTrip.status || 'completed').toLowerCase();
  const isCompleted = rawStatus === 'completed';
  const statusDisplay = isCompleted ? 'Completed' : 'Cancelled';

  const extras  = TRIP_EXTRAS[tripId] ?? { distance: rawTrip.distance_km ? `${rawTrip.distance_km} km` : '2.5 km', payment: (rawTrip.payment_method || 'Cash').toUpperCase(), passengerRating: 5.0, duration: rawTrip.estimated_duration_mins ? `${rawTrip.estimated_duration_mins} mins` : '8 mins' };
  const steps = isCompleted ? COMPLETED_STEPS : CANCELLED_STEPS;
  const ratingObj = Array.isArray(rawTrip.rating) ? rawTrip.rating[0] : rawTrip.rating;
  const actualRatingScore = ratingObj?.score ? Number(ratingObj.score) : null;
  const actualComment = ratingObj?.comment ? ratingObj.comment : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Trip ID + Status Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <Image
              source={require('../assets/tricycle.png')}
              style={styles.tricycleImg}
              tintColor={COLORS.primary}
            />
            <View>
              <Text style={styles.tripId}>{tripId}</Text>
              <Text style={styles.tripDate}>{tripDate}</Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isCompleted ? '#DCFCE7' : '#FEE2E2' },
          ]}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'close-circle'}
              size={14}
              color={isCompleted ? COLORS.success : COLORS.danger}
            />
            <Text style={[
              styles.statusText,
              { color: isCompleted ? COLORS.success : COLORS.danger },
            ]}>
              {statusDisplay}
            </Text>
          </View>
        </View>

        {/* ── Fare Hero */}
        <View style={styles.fareCard}>
          <View style={styles.fareCardInner}>
            <Text style={styles.fareLabelHero}>Total Fare Earned</Text>
            <Text style={styles.fareAmountHero}>
              {isCompleted ? fareDisplay : '₱ 0.00'}
            </Text>
            {isCompleted && (
              <View style={styles.fareMetaRow}>
                <View style={styles.fareMetaItem}>
                  <Ionicons name="speedometer-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.fareMetaText}>{extras.distance}</Text>
                </View>
                <View style={styles.fareMetaDot} />
                <View style={styles.fareMetaItem}>
                  <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.fareMetaText}>{extras.duration}</Text>
                </View>
                <View style={styles.fareMetaDot} />
                <View style={styles.fareMetaItem}>
                  <Ionicons name="cash-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.fareMetaText}>{extras.payment}</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.fareBubble1} />
          <View style={styles.fareBubble2} />
        </View>

        {/* ── Passenger Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Passenger</Text>
          <View style={styles.passengerRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={26} color={COLORS.primary} />
            </View>
            <View style={styles.passengerMeta}>
              <Text style={styles.passengerName}>{passengerName}</Text>
              {isCompleted && actualRatingScore ? (
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= actualRatingScore ? 'star' : 'star-outline'}
                      size={14}
                      color="#F59E0B"
                    />
                  ))}
                  <Text style={styles.ratingText}>{actualRatingScore.toFixed(1)}</Text>
                </View>
              ) : isCompleted ? (
                <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Not Rated Yet</Text>
              ) : null}
              {actualComment && (
                <Text style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', marginTop: 4 }}>
                  "{actualComment}"
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* ── Route Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Route</Text>

          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={[styles.routeDot, { backgroundColor: COLORS.success }]} />
              <View style={styles.routeLine} />
              <View style={[styles.routeDot, { backgroundColor: COLORS.danger }]} />
            </View>
            <View style={styles.routeTextCol}>
              <View style={styles.routeStop}>
                <Text style={styles.routeStopLabel}>PICKUP</Text>
                <Text style={styles.routeStopText}>{pickupLocation}</Text>
              </View>
              <View style={[styles.routeStop, { marginTop: 12 }]}>
                <Text style={styles.routeStopLabel}>DESTINATION</Text>
                <Text style={styles.routeStopText}>{dropoffLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Trip Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Trip Timeline</Text>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isCancelledStep = step.icon === 'close-circle';
            
            // Map step to timestamp
            let stepTime = '';
            if (index === 0 && (rawTrip.accepted_at || rawTrip.requested_at)) {
              stepTime = new Date(rawTrip.accepted_at || rawTrip.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (index === 1 && rawTrip.arrived_at) {
              stepTime = new Date(rawTrip.arrived_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (index === 2 && rawTrip.started_at) {
              stepTime = new Date(rawTrip.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (index === 3 && (rawTrip.completed_at || rawTrip.updated_at)) {
              stepTime = new Date(rawTrip.completed_at || rawTrip.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (isCancelledStep && rawTrip.cancelled_at) {
              stepTime = new Date(rawTrip.cancelled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            return (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineIconCol}>
                  <View style={[
                    styles.timelineIconWrap,
                    isCancelledStep
                      ? { backgroundColor: '#FEE2E2' }
                      : { backgroundColor: '#EEF2FF' },
                  ]}>
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={isCancelledStep ? COLORS.danger : COLORS.secondary}
                    />
                  </View>
                  {!isLast && <View style={styles.timelineConnector} />}
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[
                    styles.timelineLabel,
                    isCancelledStep && { color: COLORS.danger },
                  ]}>
                    {step.label}
                  </Text>
                  {stepTime ? (
                    <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>
                      {stepTime}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Trip Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Fare Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base Fare</Text>
            <Text style={styles.breakdownValue}>{isCompleted ? fareDisplay : '₱ 0.00'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Distance</Text>
            <Text style={styles.breakdownValue}>{extras.distance}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Payment Method</Text>
            <Text style={styles.breakdownValue}>{isCompleted ? extras.payment : '—'}</Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownTotal]}>
            <Text style={styles.breakdownTotalLabel}>Total Earned</Text>
            <Text style={styles.breakdownTotalValue}>
              {isCompleted ? fareDisplay : '₱ 0.00'}
            </Text>
          </View>
        </View>

        {/* ── Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back to Trips</Text>
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
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  scroll: {
    padding: 16,
    paddingBottom: 36,
  },

  // ── Banner card
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tricycleImg: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginRight: 10,
  },
  tripId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  tripDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },

  // ── Fare hero
  fareCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 22,
    padding: 22,
    marginBottom: 14,
    overflow: 'hidden',
  },
  fareCardInner: {
    zIndex: 2,
  },
  fareLabelHero: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
  fareAmountHero: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  fareMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fareMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 3,
  },
  fareMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 8,
  },
  fareBubble1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: -30,
    top: -30,
  },
  fareBubble2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: 30,
    bottom: -20,
  },

  // ── Section card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 14,
  },

  // ── Passenger
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  passengerMeta: {
    flex: 1,
  },
  passengerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 5,
    fontWeight: '600',
  },

  // ── Route
  routeRow: {
    flexDirection: 'row',
  },
  routeIconCol: {
    alignItems: 'center',
    marginRight: 14,
    paddingTop: 4,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 4,
    minHeight: 28,
  },
  routeTextCol: {
    flex: 1,
  },
  routeStop: {
    paddingBottom: 4,
  },
  routeStopLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.gray,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  routeStopText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },

  // ── Timeline
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  timelineIconCol: {
    alignItems: 'center',
    marginRight: 14,
  },
  timelineIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.lightGray,
    marginVertical: 3,
  },
  timelineLabel: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
    paddingTop: 7,
    flex: 1,
  },

  // ── Breakdown
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  breakdownTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  breakdownTotalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  // ── Back button
  backButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
