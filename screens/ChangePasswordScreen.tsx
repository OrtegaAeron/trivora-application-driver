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
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* BANNER */}
        <View style={styles.banner}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.bannerTitle}>Security Settings</Text>
          <Text style={styles.bannerSubtitle}>
            Update your password regularly to keep your driver account safe.
          </Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          {/* CURRENT PASSWORD */}
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={COLORS.gray} />
            <TextInput
              placeholder="Enter current password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons
                name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* NEW PASSWORD */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={COLORS.gray} />
            <TextInput
              placeholder="Enter new password (min. 6 chars)"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons
                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM NEW PASSWORD */}
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

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>UPDATE PASSWORD</Text>
            )}
          </TouchableOpacity>
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
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scroll: {
    paddingVertical: 20,
  },
  banner: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
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
    shadowOffset: { width: 0, height: 5 },
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 12,
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
  saveButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
