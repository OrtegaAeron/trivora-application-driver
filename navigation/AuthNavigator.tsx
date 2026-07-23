import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

import BottomTabs from './BottomTabs';

import BookingRequestScreen from '../screens/BookingRequestScreen';
import ActiveTripScreen from '../screens/ActiveTripScreen';
import PassengerDetailsScreen from '../screens/PassengerDetailsScreen';
import TripAcceptedScreen from '../screens/TripAcceptedScreen';
import TripSummaryScreen from '../screens/TripSummaryScreen';
import RatePassengerScreen from '../screens/RatePassengerScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      {/* Authentication */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      {/* Main App */}
      <Stack.Screen
        name="Main"
        component={BottomTabs}
      />

      {/* Map */}
      <Stack.Screen
        name="Map"
        component={MapScreen}
      />

      {/* Driver Booking Flow */}
      <Stack.Screen
        name="BookingRequest"
        component={BookingRequestScreen}
      />

      <Stack.Screen
        name="TripAccepted"
        component={TripAcceptedScreen}
      />

      <Stack.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
      />

      <Stack.Screen
        name="PassengerDetails"
        component={PassengerDetailsScreen}
      />

      <Stack.Screen
        name="TripSummary"
        component={TripSummaryScreen}
      />

      <Stack.Screen
        name="RatePassenger"
        component={RatePassengerScreen}
      />
    </Stack.Navigator>
  );
}
