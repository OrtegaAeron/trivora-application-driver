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
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { useAuth } from '../services/AuthContext';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { setDriverProfile, setIsRegistered } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [toda, setToda] = useState('');
  const [franchiseId, setFranchiseId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
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
    setTimeout(() => {
      setLoading(false);

      // Save the registered driver profile to context
      setDriverProfile({
        id: 'DRV-' + Math.floor(Math.random() * 900 + 100),
        name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        plateNumber: plateNumber.trim().toUpperCase(),
        toda: toda.trim(),
        franchiseId: franchiseId.trim().toUpperCase(),
        rating: 0,
        totalTrips: 0,
        isOnline: false,
      });

      setIsRegistered(true);

      Alert.alert(
        'Registration Successful! 🎉',
        'Your account has been created. Please log in to continue.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    }, 1800);
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

          {renderInput('Tricycle Plate / Body Number', 'card-outline', plateNumber, setPlateNumber, {
            placeholder: 'e.g. TRV-102',
            capitalize: 'characters',
          })}
          {renderInput('TODA / Barangay Assignment', 'business-outline', toda, setToda, {
            placeholder: 'e.g. TODA Zone 1 - Poblacion',
            capitalize: 'words',
          })}

          <Text style={styles.label}>Franchise ID / Number</Text>
          <View style={[styles.inputContainer, styles.franchiseHighlight]}>
            <Ionicons name="id-card-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={[styles.input, { color: COLORS.black }]}
              value={franchiseId}
              onChangeText={setFranchiseId}
              autoCapitalize="characters"
              placeholderTextColor="#999"
              placeholder="e.g. FRN-2024-0001"
            />
          </View>
          <Text style={styles.hint}>
            📄 Your franchise/accreditation number issued by the LGU or TODA.
          </Text>
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
});
