import React from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen         from '../screens/HomeScreen';
import TripHistoryScreen  from '../screens/TripHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen      from '../screens/ProfileScreen';

import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

// ── Badge dot component
function BadgeDot({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={styles.badge}>
      {/* intentionally no text — keep it clean as a dot */}
    </View>
  );
}

// ── Custom tab icon with active pill highlight
function TabIcon({
  name,
  focused,
  badgeCount = 0,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  badgeCount?: number;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activePill} />}
      <Ionicons
        name={name}
        size={24}
        color={focused ? COLORS.primary : COLORS.gray}
      />
      {badgeCount > 0 && <BadgeDot count={badgeCount} />}
    </View>
  );
}

// ── Mock unread notifications count (replace with real state/context)
const UNREAD_NOTIFICATIONS = 3;

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {/* ── HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />

      {/* ── TRIPS */}
      <Tab.Screen
        name="Trips"
        component={TripHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              {focused && <View style={styles.activePill} />}
              <Image
                source={require('../assets/tricycle.png')}
                style={[
                  styles.tricycleIcon,
                  { tintColor: focused ? COLORS.primary : COLORS.gray },
                ]}
              />
            </View>
          ),
        }}
      />

      {/* ── NOTIFICATIONS */}
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'notifications' : 'notifications-outline'}
              focused={focused}
              badgeCount={UNREAD_NOTIFICATIONS}
            />
          ),
        }}
      />

      {/* ── PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'person-circle' : 'person-circle-outline'}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // ── Tab Bar container
  tabBar: {
    height: Platform.OS === 'ios' ? 82 : 68,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#1E2A5A',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },

  // ── Per-item flex container
  tabItem: {
    paddingVertical: 2,
  },

  // ── Label typography
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // ── Icon + pill wrapper
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
  },

  // ── Active pill behind the icon
  activePill: {
    position: 'absolute',
    width: 44,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
  },

  // ── Tricycle image icon
  tricycleIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },

  // ── Notification badge dot
  badge: {
    position: 'absolute',
    top: 2,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});


