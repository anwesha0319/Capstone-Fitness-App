import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarathonPlanScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [marathonPlan, setMarathonPlan] = useState(null);
  const [currentDistance, setCurrentDistance] = useState('5');
  const [targetDate, setTargetDate] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  
  // User data from analytics
  const [avgSteps, setAvgSteps] = useState('8000');
  const [spo2, setSpo2] = useState('98');
  const [restingHeartRate, setRestingHeartRate] = useState('72');
  const [avgSleep, setAvgSleep] = useState('7');
  const [goalTime, setGoalTime] = useState('4');

  const generatePlan = async () => {
    if (!targetDate) {
      Alert.alert('Required', 'Please enter target race date (YYYY-MM-DD)');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.post(
        'http://192.168.29.52:8000/api/ml/marathon-plan/',
        {
          current_distance: parseFloat(currentDistance),
          target_date: targetDate,
          experience_level: experienceLevel,
          avg_steps: parseInt(avgSteps),
          spo2: parseInt(spo2),
          resting_heart_rate: parseInt(restingHeartRate),
          avg_sleep: parseFloat(avgSleep),
          goal_time: parseFloat(goalTime),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMarathonPlan(response.data.marathon_plan);
      }
    } catch (error) {
      console.error('Marathon plan error:', error);
      Alert.alert('Error', 'Failed to generate marathon plan. Check date format (YYYY-MM-DD)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1A3A3A', '#2A4F4F'] : ['#7A9B9E', '#A8C5C7']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Marathon Prep</Text>
        </View>

        {!marathonPlan ? (
          <View>
            {/* Input Form */}
            <View style={[styles.card, { backgroundColor: 'transparent', borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Average Daily Steps</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={avgSteps}
                onChangeText={setAvgSteps}
                keyboardType="numeric"
                placeholder="e.g., 8000"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                SpO2 Level (%)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={spo2}
                onChangeText={setSpo2}
                keyboardType="numeric"
                placeholder="e.g., 98"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Resting Heart Rate (bpm)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={restingHeartRate}
                onChangeText={setRestingHeartRate}
                keyboardType="numeric"
                placeholder="e.g., 72"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Average Sleep (hours)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={avgSleep}
                onChangeText={setAvgSleep}
                keyboardType="decimal-pad"
                placeholder="e.g., 7"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Goal Time (hours)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={goalTime}
                onChangeText={setGoalTime}
                keyboardType="decimal-pad"
                placeholder="e.g., 4"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>Experience Level</Text>
              <View style={styles.buttonGroup}>
                {[
                  { key: 'beginner', label: 'Beginner' },
                  { key: 'intermediate', label: 'Intermediate' },
                  { key: 'advanced', label: 'Advanced' }
                ].map((level) => (
                  <TouchableOpacity
                    key={level.key}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: experienceLevel === level.key ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setExperienceLevel(level.key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: experienceLevel === level.key ? '#fff' : colors.textPrimary },
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Current Running Distance (km)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={currentDistance}
                onChangeText={setCurrentDistance}
                keyboardType="numeric"
                placeholder="e.g., 5"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Target Race Date (YYYY-MM-DD)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                value={targetDate}
                onChangeText={setTargetDate}
                placeholder="e.g., 2026-06-15"
                placeholderTextColor={colors.textTertiary}
              />

              <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.accent }]}
                onPress={generatePlan}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.generateButtonText}>Generate Marathon Plan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {/* Marathon Plan Results */}
            <View style={[styles.card, { backgroundColor: 'transparent', borderColor: colors.border }]}>
              <View style={styles.resultHeader}>
                <Icon name="run-fast" size={32} color={colors.purple} />
                <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
                  Your Marathon Training Plan
                </Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Weeks Until Race</Text>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {marathonPlan.weeks_until_race}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Current Distance</Text>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {marathonPlan.current_distance} km
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Target Distance</Text>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {marathonPlan.target_distance} km
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Training Phases</Text>
              {marathonPlan.phases.map((phase, idx) => (
                <View key={idx} style={[styles.phaseCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
                  <View style={styles.phaseHeader}>
                    <Icon name="calendar-range" size={20} color={colors.accent} />
                    <Text style={[styles.phaseName, { color: colors.textPrimary }]}>
                      {phase.phase}
                    </Text>
                  </View>
                  <View style={styles.phaseDetails}>
                    <View style={styles.phaseRow}>
                      <Text style={[styles.phaseLabel, { color: colors.textTertiary }]}>Weekly Distance:</Text>
                      <Text style={[styles.phaseValue, { color: colors.textPrimary }]}>
                        {phase.weekly_distance}
                      </Text>
                    </View>
                    <View style={styles.phaseRow}>
                      <Text style={[styles.phaseLabel, { color: colors.textTertiary }]}>Long Run:</Text>
                      <Text style={[styles.phaseValue, { color: colors.textPrimary }]}>
                        {phase.long_run}
                      </Text>
                    </View>
                    <View style={styles.phaseRow}>
                      <Text style={[styles.phaseLabel, { color: colors.textTertiary }]}>Focus:</Text>
                      <Text style={[styles.phaseValue, { color: colors.textPrimary }]}>
                        {phase.focus}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Template</Text>
              <View style={[styles.templateCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
                {Object.entries(marathonPlan.weekly_template).map(([day, workout]) => (
                  <View key={day} style={styles.templateRow}>
                    <Text style={[styles.dayText, { color: colors.textPrimary }]}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Text style={[styles.workoutText, { color: colors.textSecondary }]}>
                      {workout}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Nutrition Tips</Text>
              {marathonPlan.nutrition_tips.map((tip, idx) => (
                <Text key={idx} style={[styles.tip, { color: colors.textSecondary }]}>
                  • {tip}
                </Text>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Injury Prevention</Text>
              {marathonPlan.injury_prevention.map((tip, idx) => (
                <Text key={idx} style={[styles.tip, { color: colors.textSecondary }]}>
                  • {tip}
                </Text>
              ))}

              <TouchableOpacity
                style={[styles.regenerateButton, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
                onPress={() => setMarathonPlan(null)}
              >
                <Text style={[styles.regenerateText, { color: colors.textPrimary }]}>
                  Generate New Plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  generateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  phaseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phaseDetails: {
    gap: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseLabel: {
    fontSize: 13,
  },
  phaseValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  templateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  workoutText: {
    fontSize: 13,
    flex: 1,
  },
  tip: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  regenerateButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
  },
  regenerateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 20,
  },
});

export default MarathonPlanScreen;
