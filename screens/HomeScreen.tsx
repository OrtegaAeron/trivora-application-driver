import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';

import DriverHomeHeader from '../components/DriverHomeHeader';
import OnlineStatusCard from '../components/OnlineStatusCard';
import MapPreview from '../components/MapPreview';
import IncomingBookingCard from '../components/IncomingBookingCard';
import QuickStatsRow from '../components/QuickStatsRow';
import RecentTripCard from '../components/RecentTripCard';

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <DriverHomeHeader />

        <OnlineStatusCard
          initialOnline={isOnline}
          onToggle={(status) => setIsOnline(status)}
        />

        <MapPreview />

        <IncomingBookingCard hasRequest={isOnline} />

        <QuickStatsRow />

        <RecentTripCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 30,
  },
});
