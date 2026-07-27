import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { setDriverProfile, setIsRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    let hasError = false;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    if (!email.trim()) {
      setEmailError('Email or Driver License Number is required.');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    const apiUrls = [
      'http://192.168.254.204:8000/api/v1/driver/login',
      'http://192.168.254.205:8000/api/v1/driver/login',
      'http://10.0.2.2:8000/api/v1/driver/login',
      'http://localhost:8000/api/v1/driver/login',
      'http://127.0.0.1:8000/api/v1/driver/login',
    ];

    let loggedIn = false;
    let lastErrMsg = '';

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            login: email.trim(),
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          loggedIn = true;
          setDriverProfile({
            id: data.driver ? `DRV-${data.driver.id}` : 'DRV-888',
            name: (data.user?.name || data.operator?.full_name || 'Pedro Ramos').replace(/\s*\(.*?\)\s*/g, ''),
            email: data.user?.email || email.trim(),
            mobile: data.driver?.mobile_number || data.operator?.contact_number || '09188887777',
            plateNumber: data.tricycle?.plate_number || 'TRV-BRGY8',
            codingSchemeNumber: data.tricycle?.coding_scheme_number || data.tricycle?.body_number || '0142',
            toda: data.operator?.toda_zone || data.tricycle?.toda_zone || 'TODA Brgy. 8',
            franchiseId: data.driver?.license_number || data.operator?.license_number || 'N01-18-000888',
            rating: data.driver?.rating || 5.0,
            totalTrips: data.driver?.total_trips ?? 0,
            trackingCapability: data.tricycle?.tracking_capability || 'mobile_only',
            trackingMode: data.tricycle?.active_tracking_mode || (data.tricycle?.tracking_capability === 'iot_enabled' ? 'iot_device' : 'mobile_app'),
            isOnline: true,
          });
          setIsRegistered(true);
          break;
        } else {
          lastErrMsg = data.message || 'Invalid email or password.';
          if (response.status === 401 || response.status === 403 || response.status === 422) {
            break;
          }
        }
      } catch (err: any) {
        lastErrMsg = err.message || 'Connection error to server.';
      }
    }

    setLoading(false);

    if (loggedIn) {
      navigation.replace('Main');
    } else {
      setAuthError(lastErrMsg || 'Invalid email or password.');
    }
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
          {/* AUTHENTICATION ERROR BANNER */}
          {!!authError && (
            <View style={styles.authErrorCard}>
              <Ionicons name="alert-circle" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={styles.authErrorText}>{authError}</Text>
            </View>
          )}

          <Text style={styles.label}>
            Email Address / Driver ID
          </Text>

          <View style={[styles.inputContainer, !!emailError && styles.inputError]}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={emailError ? COLORS.danger : COLORS.gray}
            />

            <TextInput
              placeholder="Enter your email or driver ID"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <Text style={styles.label}>
            Password
          </Text>

          <View style={[styles.inputContainer, !!passwordError && styles.inputError]}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={passwordError ? COLORS.danger : COLORS.gray}
            />

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
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
          {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

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

  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 1.5,
  },

  authErrorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },

  authErrorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '600',
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
