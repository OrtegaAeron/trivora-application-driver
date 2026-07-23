import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { MOCK_BOOKING_REQUEST } from '../services/api';

export default function RatePassengerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const passenger = route.params?.passenger || MOCK_BOOKING_REQUEST.passenger;

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating (1 to 5 stars) for the passenger.');
      return;
    }

    Alert.alert(
      'Feedback Submitted',
      'Thank you for rating your passenger! Your feedback helps keep TRIVORA safe and reliable.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Passenger</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* PASSENGER CARD */}
        <View style={styles.card}>
          <Ionicons name="person-circle" size={80} color={COLORS.primary} />
          <Text style={styles.name}>{passenger.name}</Text>
          <Text style={styles.subtitle}>How was your experience with this passenger?</Text>

          {/* STAR RATING */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starTouch}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={42}
                  color={star <= rating ? '#F4B400' : COLORS.border}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 5 && 'Excellent Passenger! 🌟'}
              {rating === 4 && 'Good Experience 👍'}
              {rating === 3 && 'Average Trip 😐'}
              {rating === 2 && 'Needs Improvement 👎'}
              {rating === 1 && 'Poor Experience ⚠️'}
            </Text>
          )}

          {/* FEEDBACK INPUT */}
          <Text style={styles.label}>Additional Comments (Optional)</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Share details about passenger behavior, punctuality..."
              placeholderTextColor="#999"
              style={styles.input}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* PREVIEW CARD */}
          {rating > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Review Summary</Text>
              <Text style={styles.previewStars}>Rating: {'⭐'.repeat(rating)}</Text>
              {comment.trim().length > 0 && (
                <Text style={styles.previewComment}>"{comment}"</Text>
              )}
            </View>
          )}

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>SUBMIT RATING</Text>
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
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },

  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },

  starTouch: {
    paddingHorizontal: 6,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },

  label: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },

  inputBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  input: {
    fontSize: 15,
    color: COLORS.black,
    textAlignVertical: 'top',
    height: 100,
  },

  previewCard: {
    width: '100%',
    backgroundColor: '#EEF2FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },

  previewTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  previewStars: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 4,
  },

  previewComment: {
    fontSize: 13,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 4,
  },

  submitButton: {
    width: '100%',
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});
