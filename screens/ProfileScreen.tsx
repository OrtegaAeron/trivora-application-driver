import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { MOCK_DRIVER } from '../services/api';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState(MOCK_DRIVER.name);
  const [email] = useState(MOCK_DRIVER.email);
  const [mobile, setMobile] = useState(MOCK_DRIVER.mobile);
  const [plateNumber, setPlateNumber] = useState(MOCK_DRIVER.plateNumber);
  const [toda, setToda] = useState(MOCK_DRIVER.toda);

  const handleSaveProfile = () => {
    Alert.alert('Profile Saved', 'Your driver profile details have been updated successfully.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out of TRIVORA Driver App?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* HEADER WITH AVATAR */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={110} color="#FFFFFF" />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => Alert.alert('Update Photo', 'Choose photo from library or take a photo.')}
            >
              <Ionicons name="camera" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.driverName}>{name}</Text>
          <Text style={styles.driverMeta}>⭐ {MOCK_DRIVER.rating} • {MOCK_DRIVER.totalTrips} Total Trips</Text>
        </View>

        {/* VEHICLE CODING SCHEME STATUS CARD */}
        {MOCK_DRIVER.codingInfo && (
          <View style={[
            styles.codingCard,
            MOCK_DRIVER.codingInfo.isCodingToday ? styles.codingCardDanger : styles.codingCardSuccess
          ]}>
            <View style={styles.codingHeaderRow}>
              <View style={styles.codingBadgeRow}>
                <Ionicons
                  name={MOCK_DRIVER.codingInfo.isCodingToday ? 'alert-circle' : 'checkmark-circle'}
                  size={24}
                  color={MOCK_DRIVER.codingInfo.isCodingToday ? COLORS.danger : COLORS.success}
                />
                <Text style={styles.codingTitle}>Vehicle Coding Status</Text>
              </View>
              <View style={[
                styles.statusPill,
                { backgroundColor: MOCK_DRIVER.codingInfo.isCodingToday ? '#FEF2F2' : '#DCFCE7' }
              ]}>
                <Text style={[
                  styles.statusPillText,
                  { color: MOCK_DRIVER.codingInfo.isCodingToday ? COLORS.danger : COLORS.success }
                ]}>
                  {MOCK_DRIVER.codingInfo.isCodingToday ? 'RESTRICTED TODAY' : 'ALLOWED TODAY'}
                </Text>
              </View>
            </View>

            <Text style={styles.codingAlertText}>
              {MOCK_DRIVER.codingInfo.isCodingToday
                ? `⛔ Today is your assigned coding day (${MOCK_DRIVER.codingInfo.codingDay}). You are NOT allowed to operate your vehicle.`
                : `✅ Today is not your coding day. You are cleared to operate.`}
            </Text>

            <View style={styles.codingDetailsGrid}>
              <View style={styles.codingDetailBox}>
                <Text style={styles.codingDetailLabel}>Plate Body No.</Text>
                <Text style={styles.codingDetailVal}>{MOCK_DRIVER.plateNumber}</Text>
              </View>

              <View style={styles.codingDetailBox}>
                <Text style={styles.codingDetailLabel}>Assigned Coding Day</Text>
                <Text style={styles.codingDetailVal}>{MOCK_DRIVER.codingInfo.codingDay}</Text>
              </View>

              <View style={styles.codingDetailBox}>
                <Text style={styles.codingDetailLabel}>Restricted Digits</Text>
                <Text style={styles.codingDetailVal}>{MOCK_DRIVER.codingInfo.restrictedDigits}</Text>
              </View>

              <View style={styles.codingDetailBox}>
                <Text style={styles.codingDetailLabel}>Restricted Hours</Text>
                <Text style={styles.codingDetailVal}>{MOCK_DRIVER.codingInfo.scheduleHours}</Text>
              </View>
            </View>
          </View>
        )}

        {/* EDITABLE FIELDS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver Profile Details</Text>

          {/* FULL NAME */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* EMAIL (NON-EDITABLE) */}
          <Text style={styles.label}>Email Address (Read-only)</Text>
          <View style={[styles.inputContainer, styles.readOnlyInput]}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={[styles.input, { color: COLORS.gray }]}
              value={email}
              editable={false}
            />
            <Ionicons name="lock-closed" size={18} color={COLORS.gray} />
          </View>

          {/* MOBILE NUMBER */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          {/* TRICYCLE PLATE NUMBER */}
          <Text style={styles.label}>Tricycle Plate / Body Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              value={plateNumber}
              onChangeText={setPlateNumber}
            />
          </View>

          {/* TODA / BARANGAY */}
          <Text style={styles.label}>TODA / Barangay Assignment</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              value={toda}
              onChangeText={setToda}
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* CHANGE PASSWORD */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Ionicons name="key-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Change Password</Text>
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
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

  scroll: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 35,
    alignItems: 'center',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  driverMeta: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 25,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  // ── Vehicle Coding Status Card
  codingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 25,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  codingCardDanger: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.danger,
  },

  codingCardSuccess: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.success,
  },

  codingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  codingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  codingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginLeft: 8,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  codingAlertText: {
    fontSize: 13.5,
    color: COLORS.black,
    lineHeight: 19,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },

  codingDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  codingDetailBox: {
    width: '48%',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },

  codingDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 2,
  },

  codingDetailVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.black,
  },


  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
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
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 54,
  },

  readOnlyInput: {
    backgroundColor: '#F1F5F9',
  },

  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    color: COLORS.black,
  },

  saveButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 20,
  },

  secondaryButton: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  logoutButton: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 15,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
