import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;

            case 'History':
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="History"
        component={TripHistoryScreen}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
