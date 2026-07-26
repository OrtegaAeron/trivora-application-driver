import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { driverProfile, isRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/trivora_icon.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Login to continue using the TRIVORA Driver App.
          </Text>
        </View>

        {/* LOGIN CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Email Address / Driver ID
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              placeholder="Enter your email or driver ID"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* OPTIONS */}
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.remember}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={
                  rememberMe
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.rememberText}>
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgot}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginText}>
                LOGIN
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* REGISTER LINK */}
        <TouchableOpacity
          style={styles.registerLinkRow}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account?{' '}
            <Text style={styles.registerLinkBold}>Register Here</Text>
          </Text>
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

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  logo: {
    width: 270,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 35,
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 8,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 58,
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },

  options: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rememberText: {
    marginLeft: 8,
    color: COLORS.gray,
    fontSize: 15,
  },

  forgot: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },

  loginButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  registerLinkRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  registerLinkText: {
    fontSize: 15,
    color: COLORS.gray,
  },

  registerLinkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
