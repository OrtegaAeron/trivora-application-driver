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
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

const TODA_OPTIONS = [
  'TODA Bucana',
  'TODA Brgy. 10',
  'TODA Brgy. 8',
  'TODA Brgy. 4',
];

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { setDriverProfile, setIsRegistered } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [toda, setToda] = useState('TODA Bucana');
  const [showTodaPicker, setShowTodaPicker] = useState(false);
  const [franchiseId, setFranchiseId] = useState('');
  const [trackingMode, setTrackingMode] = useState<'iot_enabled' | 'mobile_only'>('iot_enabled');
  const [iotDeviceId, setIotDeviceId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !mobile.trim() || !plateNumber.trim() || !toda.trim() || !franchiseId.trim() || !password || !confirmPassword) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before registering.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const apiUrls = [
      'http://192.168.254.204:8000/api/v1/driver/register',
      'http://192.168.254.205:8000/api/v1/driver/register',
      'http://10.0.2.2:8000/api/v1/driver/register',
      'http://localhost:8000/api/v1/driver/register',
      'http://127.0.0.1:8000/api/v1/driver/register',
    ];

    let successResponse = null;
    let lastErrorMsg = '';

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            mobile_number: mobile.trim(),
            plate_number: plateNumber.trim().toUpperCase(),
            toda: toda.trim(),
            license_number: franchiseId.trim().toUpperCase(),
            tracking_capability: trackingMode,
            iot_device_id: trackingMode === 'iot_enabled' ? iotDeviceId.trim() : null,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          successResponse = data;
          break;
        } else {
          lastErrorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Validation failed.');
        }
      } catch (err: any) {
        lastErrorMsg = err.message || 'Connection error to backend server.';
      }
    }

    setLoading(false);

    if (successResponse) {
      setDriverProfile({
        id: successResponse.driver ? `DRV-${successResponse.driver.id}` : 'DRV-102',
        name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        plateNumber: plateNumber.trim().toUpperCase(),
        toda: toda.trim(),
        franchiseId: franchiseId.trim().toUpperCase(),
        rating: 5.0,
        totalTrips: 0,
        isOnline: false,
      });

      setIsRegistered(true);

      if (Platform.OS === 'web') {
        alert('Registration Successful 🎉\nYour driver account has been saved in the database. Please log in.');
        navigation.replace('Login');
      } else {
        Alert.alert(
          'Registration Successful 🎉',
          'Your driver account has been saved in the database. Please log in.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.replace('Login'),
            },
          ]
        );
      }
    } else {
      if (Platform.OS === 'web') {
        alert(`Registration Error: ${lastErrorMsg || 'Could not connect to database server.'}`);
      } else {
        Alert.alert('Registration Error', lastErrorMsg || 'Could not connect to database server.');
      }
    }
  };

  const renderInput = (
    label: string,
    iconName: any,
    value: string,
    onChange: (v: string) => void,
    options?: {
      keyboard?: any;
      capitalize?: any;
      placeholder?: string;
      secure?: boolean;
      showToggle?: boolean;
      onToggle?: () => void;
      isVisible?: boolean;
      readonly?: boolean;
    }
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, options?.readonly && styles.readOnlyInput]}>
        <Ionicons name={iconName} size={20} color={COLORS.gray} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType={options?.keyboard ?? 'default'}
          autoCapitalize={options?.capitalize ?? 'words'}
          placeholderTextColor="#999"
          placeholder={options?.placeholder ?? ''}
          secureTextEntry={options?.secure && !options?.isVisible}
          editable={!options?.readonly}
        />
        {options?.showToggle && (
          <TouchableOpacity onPress={options?.onToggle}>
            <Ionicons
              name={options?.isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/trivora_icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Register as a TRIVORA Driver and start earning today.
          </Text>
        </View>

        {/* PERSONAL INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          {renderInput('Full Name', 'person-outline', fullName, setFullName, {
            placeholder: 'e.g. Juan Dela Cruz',
            capitalize: 'words',
          })}
          {renderInput('Email Address', 'mail-outline', email, setEmail, {
            placeholder: 'e.g. juan@email.com',
            keyboard: 'email-address',
            capitalize: 'none',
          })}
          {renderInput('Mobile Number', 'call-outline', mobile, setMobile, {
            placeholder: 'e.g. +63 917 000 0000',
            keyboard: 'phone-pad',
            capitalize: 'none',
          })}
        </View>

        {/* VEHICLE & FRANCHISE INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Vehicle & Franchise Details</Text>
          </View>

          {renderInput('Tricycle Plate Number', 'card-outline', plateNumber, setPlateNumber, {
            placeholder: 'e.g. AAA-1234',
            capitalize: 'characters',
          })}

          {/* TODA DROPDOWN SELECTOR */}
          <Text style={styles.label}>TODA Assignment</Text>
          <TouchableOpacity
            style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => setShowTodaPicker(true)}
          >
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.input, { color: toda ? COLORS.black : '#999', fontSize: 15 }]}>
              {toda || 'Select TODA Assignment'}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <Text style={styles.label}>License / Franchise Permit No.</Text>
          <View style={[styles.inputContainer, styles.franchiseHighlight]}>
            <Ionicons name="id-card-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={[styles.input, { color: COLORS.black }]}
              value={franchiseId}
              onChangeText={setFranchiseId}
              autoCapitalize="characters"
              placeholderTextColor="#999"
              placeholder="e.g. PERMIT-2026-0142"
            />
          </View>

          {/* TELEMATICS TRACKING CAPABILITY SELECTOR */}
          <Text style={[styles.label, { marginTop: 14 }]}>GPS Tracking Method</Text>
          <View style={{ gap: 8, marginTop: 4 }}>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                { height: 48, paddingHorizontal: 12 },
                trackingMode === 'iot_enabled' && { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: '#EEF2FF' }
              ]}
              onPress={() => setTrackingMode('iot_enabled')}
            >
              <Ionicons
                name={trackingMode === 'iot_enabled' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={trackingMode === 'iot_enabled' ? COLORS.primary : COLORS.gray}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.black }}>Smart IoT GPS Tracker</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.inputContainer,
                { height: 48, paddingHorizontal: 12 },
                trackingMode === 'mobile_only' && { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: '#EEF2FF' }
              ]}
              onPress={() => setTrackingMode('mobile_only')}
            >
              <Ionicons
                name={trackingMode === 'mobile_only' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={trackingMode === 'mobile_only' ? COLORS.primary : COLORS.gray}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.black }}>Mobile Phone GPS</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* CONDITIONAL IOT DEVICE ID INPUT */}
          {trackingMode === 'iot_enabled' && (
            <View style={{ marginTop: 8 }}>
              {renderInput('IoT Device ID', 'hardware-chip-outline', iotDeviceId, setIotDeviceId, {
                placeholder: 'e.g. TRV-GPS-991',
                capitalize: 'characters',
              })}
            </View>
          )}
        </View>

        {/* ACCOUNT SECURITY */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Account Security</Text>
          </View>

          {renderInput('Password', 'lock-closed-outline', password, setPassword, {
            secure: true,
            isVisible: showPassword,
            showToggle: true,
            onToggle: () => setShowPassword(!showPassword),
            placeholder: 'Minimum 6 characters',
            capitalize: 'none',
          })}
          {renderInput('Confirm Password', 'lock-closed-outline', confirmPassword, setConfirmPassword, {
            secure: true,
            isVisible: showConfirmPassword,
            showToggle: true,
            onToggle: () => setShowConfirmPassword(!showConfirmPassword),
            placeholder: 'Re-enter your password',
            capitalize: 'none',
          })}

          {/* REGISTER BUTTON */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.registerText}>CREATE ACCOUNT</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ALREADY HAVE AN ACCOUNT */}
        <TouchableOpacity
          style={styles.loginLinkRow}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account?{' '}
            <Text style={styles.loginLinkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* TODA SELECTION MODAL */}
      <Modal
        visible={showTodaPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTodaPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTodaPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select TODA Assignment</Text>
              <TouchableOpacity onPress={() => setShowTodaPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {TODA_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.todaOption,
                  toda === item && styles.todaOptionSelected,
                ]}
                onPress={() => {
                  setToda(item);
                  setShowTodaPicker(false);
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={toda === item ? COLORS.primary : COLORS.gray}
                />
                <Text
                  style={[
                    styles.todaOptionText,
                    toda === item && styles.todaOptionTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {toda === item && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingVertical: 20,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 30,
  },

  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 25,
    padding: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 6,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },

  readOnlyInput: {
    backgroundColor: '#F1F5F9',
  },

  franchiseHighlight: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: '#EEF2FF',
  },

  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    color: COLORS.black,
  },

  hint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
    lineHeight: 17,
  },

  registerButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 8,
  },

  loginLinkRow: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },

  loginLinkText: {
    fontSize: 15,
    color: COLORS.gray,
  },

  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  todaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  todaOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  todaOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: 12,
    flex: 1,
  },
  todaOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
