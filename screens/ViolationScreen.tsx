import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';
import { MOCK_VIOLATIONS, MOCK_DRIVER } from '../services/api';
import { ViolationRecord } from '../types';

export default function ViolationScreen() {
  const [violations] = useState<ViolationRecord[]>(MOCK_VIOLATIONS);
  const [selectedViolation, setSelectedViolation] = useState<ViolationRecord | null>(null);

  const unpaidCount = violations.filter((v) => v.status === 'Unpaid').length;

  const renderStatusBadge = (status: ViolationRecord['status']) => {
    let bg = '#FEF2F2';
    let text = COLORS.danger;
    let icon: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';

    if (status === 'Paid') {
      bg = '#DCFCE7';
      text = COLORS.success;
      icon = 'checkmark-circle';
    } else if (status === 'Under Review') {
      bg = '#FEF3C7';
      text = '#D97706';
      icon = 'time';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={14} color={text} />
        <Text style={[styles.badgeText, { color: text }]}>{status}</Text>
      </View>
    );
  };

  const renderViolationCard = ({ item }: { item: ViolationRecord }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => setSelectedViolation(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryRow}>
          <Ionicons
            name={item.category === 'Number Coding Violation' ? 'car-sport' : 'warning-outline'}
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        {renderStatusBadge(item.status)}
      </View>

      <Text style={styles.violationTitle}>{item.violationType}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color={COLORS.gray} />
        <Text style={styles.metaText}>{item.date} • {item.time}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.gray} />
        <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.refNo}>Ref: {item.referenceNo}</Text>
        <Text style={styles.fineText}>{item.fineAmount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Violation Records</Text>
          <Text style={styles.headerSub}>Plate: {MOCK_DRIVER.plateNumber} • Traffic & Scheme Logs</Text>
        </View>
      </View>

      {/* SUMMARY BANNER */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, unpaidCount > 0 && styles.summaryCardAlert]}>
          <Ionicons
            name={unpaidCount > 0 ? 'warning' : 'shield-checkmark'}
            size={28}
            color={unpaidCount > 0 ? COLORS.danger : COLORS.success}
          />
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryTitle}>
              {unpaidCount > 0 ? `${unpaidCount} Active Violation(s)` : 'No Active Violations'}
            </Text>
            <Text style={styles.summarySub}>
              {unpaidCount > 0
                ? 'Please settle pending fines to avoid permit suspension.'
                : 'Your driver license and vehicle record are in good standing.'}
            </Text>
          </View>
        </View>
      </View>

      {/* VIOLATION LIST */}
      <FlatList
        data={violations}
        keyExtractor={(item) => item.id}
        renderItem={renderViolationCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ribbon-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>No violation records found.</Text>
          </View>
        }
      />

      {/* DETAILS MODAL */}
      <Modal
        visible={!!selectedViolation}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedViolation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Violation Details</Text>
              <TouchableOpacity onPress={() => setSelectedViolation(null)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            {selectedViolation && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalStatusRow}>
                  {renderStatusBadge(selectedViolation.status)}
                  <Text style={styles.modalFine}>{selectedViolation.fineAmount}</Text>
                </View>

                <Text style={styles.modalType}>{selectedViolation.violationType}</Text>
                <Text style={styles.modalRef}>Reference No: {selectedViolation.referenceNo}</Text>

                <View style={styles.modalDivider} />

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Plate Number</Text>
                  <Text style={styles.detailValue}>{selectedViolation.plateNumber}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>{selectedViolation.date} at {selectedViolation.time}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedViolation.location}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Issuing Authority</Text>
                  <Text style={styles.detailValue}>{selectedViolation.issuedBy}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailDescription}>{selectedViolation.description}</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedViolation(null)}
                >
                  <Text style={styles.closeButtonText}>Close Window</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.lightGray,
    marginTop: 2,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryCardAlert: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  summaryTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  summarySub: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  refNo: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  fineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalFine: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  modalType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalRef: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  detailDescription: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
