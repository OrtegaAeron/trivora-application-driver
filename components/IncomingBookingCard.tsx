import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

interface IncomingBookingCardProps {
  hasRequest?: boolean;
}

export default function IncomingBookingCard({ hasRequest = true }: IncomingBookingCardProps) {
  const navigation = useNavigation<any>();
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  useEffect(() => {
    let intervalId: any = null;
    const host = getHost();

    async function pollPendingRequests() {
      if (!hasRequest) return;

      try {
        const response = await fetch(`http://${host}:8000/api/v1/driver/bookings/pending`, {
          headers: { 'Accept': 'application/json' },
        });
        const text = await response.text();
        if (!text || text.trim().length === 0) {
          setRequestsList([]);
          return;
        }
        const data = JSON.parse(text);

        if (data.requests && data.requests.length > 0) {
          const parsed = data.requests.map((req: any) => ({
            id: req.id,
            bookingCode: req.booking_code,
            fare: `₱${parseFloat(req.fare_amount).toFixed(2)}`,
            distance: req.distance_km ? `${req.distance_km} km` : '2.5 km',
            eta: req.estimated_duration_mins ? `${req.estimated_duration_mins} mins` : '8 mins',
            pickupLocation: req.pickup_name,
            destination: req.dropoff_name,
            pickupCoords: {
              latitude: parseFloat(req.pickup_lat) || 14.0725,
              longitude: parseFloat(req.pickup_lng) || 120.6315,
            },
            dropoffCoords: {
              latitude: parseFloat(req.dropoff_lat) || 14.0685,
              longitude: parseFloat(req.dropoff_lng) || 120.6285,
            },
            passenger: {
              name: req.passenger?.user?.name || 'Maria Clara',
              rating: req.passenger?.rating || 5.0,
              totalRides: req.passenger?.total_rides || 0,
              mobile: req.passenger?.mobile_number || '09191234567',
            },
            todaName: req.toda_zone?.name || 'TODA Brgy. 8',
          }));

          setRequestsList(parsed);
          // Auto adjust index if queue shrank
          setCurrentIndex((prev) => (prev >= parsed.length ? 0 : prev));
        } else {
          setRequestsList([]);
        }
      } catch (e) {
        console.log('[Driver IncomingCard] Poll notice:', e);
      }
    }

    pollPendingRequests();
    intervalId = setInterval(pollPendingRequests, 3000);
    return () => clearInterval(intervalId);
  }, [hasRequest]);

  if (!hasRequest || requestsList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyRadarBadge}>
          <Ionicons name="radio-outline" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>Online & Ready for Bookings</Text>
        <Text style={styles.emptyText}>Standing by for incoming TODA passenger requests near your zone...</Text>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.liveIndicatorText}>LIVE DISPATCH SCANNING ACTIVE</Text>
        </View>
      </View>
    );
  }

  const activeRequest = requestsList[currentIndex] || requestsList[0];
  const totalCount = requestsList.length;

  const nextRequest = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  };

  const prevRequest = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  };

  return (
    <View style={styles.cardWrapper}>
      {/* QUEUE COUNTER HEADER */}
      <View style={styles.previewHeader}>
        <View style={styles.queueCounterPill}>
          <Ionicons name="flash" size={14} color="#F59E0B" />
          <Text style={styles.queueCounterText}>
            REQUEST {currentIndex + 1} OF {totalCount}
          </Text>
        </View>

        {totalCount > 1 && (
          <View style={styles.navSteppers}>
            <TouchableOpacity style={styles.stepperBtn} onPress={prevRequest}>
              <Ionicons name="chevron-back" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.stepperBtn} onPress={nextRequest}>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.fareText}>{activeRequest.fare}</Text>
      </View>

      {/* PASSENGER & ROUTE DETAILS */}
      <View style={styles.passengerRow}>
        <Ionicons name="person-circle" size={40} color={COLORS.primary} />
        <View style={styles.passengerMeta}>
          <Text style={styles.passengerName}>{activeRequest.passenger.name}</Text>
          <Text style={styles.passengerSub}>Rating: 5.0 · Passenger</Text>
        </View>
      </View>

      {/* ROUTE ADDRESSES (RESPONSIVE WRAPPING LAYOUT) */}
      <View style={styles.routeWrapper}>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={18} color={COLORS.success} style={styles.addressIcon} />
          <View style={styles.addressMeta}>
            <Text style={styles.addressLabel}>PICKUP LOCATION</Text>
            <Text style={styles.addressText}>{activeRequest.pickupLocation}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="flag" size={18} color={COLORS.secondary} style={styles.addressIcon} />
          <View style={styles.addressMeta}>
            <Text style={styles.addressLabel}>DESTINATION</Text>
            <Text style={styles.addressText}>{activeRequest.destination}</Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('BookingRequest', {
              bookingRequest: activeRequest,
            })
          }
        >
          <Ionicons name="eye-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>VIEW DETAILS & ACCEPT</Text>
        </TouchableOpacity>

        {totalCount > 1 && (
          <TouchableOpacity
            style={styles.skipBtn}
            activeOpacity={0.7}
            onPress={nextRequest}
          >
            <Text style={styles.skipBtnText}>NEXT ({totalCount - 1})</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  tagBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  fareText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  passengerMeta: {
    marginLeft: 12,
    flex: 1,
  },

  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  passengerSub: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },

  routeWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  addressMeta: {
    flex: 1,
    flexShrink: 1,
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
    lineHeight: 18,
    flexWrap: 'wrap',
  },

  queueCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  queueCounterText: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 11,
  },
  navSteppers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skipBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: 'bold',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },
  emptyRadarBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 8,
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#15803D',
    letterSpacing: 0.5,
  },
});
