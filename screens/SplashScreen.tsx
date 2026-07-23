import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import COLORS from '../theme/colors';

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* TRIVORA LOGO */}
        <Image
          source={require('../assets/trivora_icon.png')}
          style={styles.logo}
        />

        <Text style={styles.subtitle}>
          TriVora Application
        </Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.loading}
        />
      </View>

      <Text style={styles.version}>
        Driver Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 290,
    height: 290,
    resizeMode: 'contain',
    marginBottom: -10,
  },

  subtitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: -10,
  },

  loading: {
    marginTop: 50,
    transform: [{ scale: 1.3 }],
  },

  version: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
});
