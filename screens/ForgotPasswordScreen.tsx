import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
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

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  // Steps: 1 = Email/Phone, 2 = OTP Verification, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // OTP Inputs Refs
  const otpRef1 = useRef<TextInput>(null);
  const otpRef2 = useRef<TextInput>(null);
  const otpRef3 = useRef<TextInput>(null);
  const otpRef4 = useRef<TextInput>(null);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Step 1: Send Reset Code
  const handleSendCode = () => {
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your registered email or mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(60);
      setCanResend(false);
    }, 1200);
  };

  // Handle OTP change
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance
    if (text && index === 0) otpRef2.current?.focus();
    if (text && index === 1) otpRef3.current?.focus();
    if (text && index === 2) otpRef4.current?.focus();
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the complete 4-digit verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  // Resend OTP
  const handleResendCode = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '']);
    Alert.alert('Code Sent', 'A new reset verification code has been sent to your email.');
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Required', 'Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER NAV */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step > 1 && step < 4) {
              setStep((prev) => (prev - 1) as any);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Password Recovery</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* LOGO & STEP HEADER */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/trivora_icon.png')}
            style={styles.logo}
          />

          {step === 1 && (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your driver email or mobile number to receive a verification code.
              </Text>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.title}>Verify Code</Text>
              <Text style={styles.subtitle}>
                Enter the 4-digit verification code sent to{' '}
                <Text style={styles.highlightText}>{email || 'your email'}</Text>
              </Text>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>
                Create a strong new password for your TRIVORA Driver account.
              </Text>
            </>
          )}

          {step === 4 && (
            <>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
              </View>
              <Text style={styles.title}>All Set!</Text>
              <Text style={styles.subtitle}>
                Your driver account password has been reset successfully. You can now login.
              </Text>
            </>
          )}
        </View>

        {/* CARD CONTAINER */}
        <View style={styles.card}>
          {/* STEP 1: ENTER EMAIL / PHONE */}
          {step === 1 && (
            <>
              <Text style={styles.label}>Email Address / Driver Mobile</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color={COLORS.gray} />
                <TextInput
                  placeholder="Enter driver email or mobile"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>SEND VERIFICATION CODE</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <>
              <Text style={styles.labelCenter}>Enter 4-Digit Code</Text>
              <View style={styles.otpContainer}>
                <TextInput
                  ref={otpRef1}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[0]}
                  onChangeText={(t) => handleOtpChange(t, 0)}
                />
                <TextInput
                  ref={otpRef2}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[1]}
                  onChangeText={(t) => handleOtpChange(t, 1)}
                />
                <TextInput
                  ref={otpRef3}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[2]}
                  onChangeText={(t) => handleOtpChange(t, 2)}
                />
                <TextInput
                  ref={otpRef4}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[3]}
                  onChangeText={(t) => handleOtpChange(t, 3)}
                />
              </View>

              <View style={styles.timerRow}>
                <Text style={styles.timerText}>
                  {canResend ? "Didn't receive the code?" : `Resend code in ${timer}s`}
                </Text>
                {canResend && (
                  <TouchableOpacity onPress={handleResendCode}>
                    <Text style={styles.resendLink}>Resend</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>VERIFY & CONTINUE</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === 3 && (
            <>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color={COLORS.gray} />
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.gray} />
                <TextInput
                  placeholder="Re-enter new password"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>RESET PASSWORD</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.buttonText}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </>
          )}

          {/* BACK TO LOGIN FOOTER */}
          {step !== 4 && (
            <View style={styles.bottom}>
              <Text style={styles.bottomText}>Remember your password?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 35,
    lineHeight: 22,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  successIconWrapper: {
    marginTop: 10,
    marginBottom: 5,
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
    marginTop: 12,
  },
  labelCenter: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 15,
    textAlign: 'center',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 15,
  },
  otpInput: {
    width: 55,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  timerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  primaryButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottom: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: COLORS.gray,
    fontSize: 15,
  },
  loginLink: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
