import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);
  const tabBarHeight = 58 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Trips':
              iconName = 'time';
              break;
            case 'Notifications':
              iconName = 'notifications';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* TRIPS */}
      <Tab.Screen
        name="Trips"
        component={TripHistoryScreen}
      />

      {/* NOTIFICATIONS */}
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}


