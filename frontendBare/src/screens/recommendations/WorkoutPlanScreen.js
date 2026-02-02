import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutPlanScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [equipment, setEquipment] = useState([]);
  const [customEquipment, setCustomEquipment] = useState('');
  
  // User data from analytics
  const [goal, setGoal] = useState('muscle_gain');
  const [foodPreference, setFoodPreference] = useState('none');
  const [avgSteps, setAvgSteps] = useState('8000');
  const [avgSleep, setAvgSleep] = useState('7');
  const [spo2, setSpo2] = useState('98');

  const goalOptions = [
    { key: 'muscle_gain', label: 'Muscle Gain' },
    { key: 'weight_loss', label: 'Weight Loss' },
    { key: 'endurance', label: 'Endurance' },
    { key: 'flexibility', label: 'Flexibility' },
  ];

  const foodOptions = [
    { key: 'none', label: 'None' },
    { key: 'vegetarian', label: 'Vegetarian' },
    { key: 'vegan', label: 'Vegan' },
    { key: 'pescatarian', label: 'Pescatarian' },
  ];

  const equipmentOptions = [
    'dumbbells', 
    'barbell', 
    'resistance_bands', 
    'pull_up_bar', 
    'kettlebell',
    'treadmill',
    'exercise_bike',
    'rowing_machine',
    'yoga_mat',
    'none'
  ];

  const toggleEquipment = (item) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const addCustomEquipment = () => {
    if (customEquipment.trim() && !equipment.includes(customEquipment.trim())) {
      setEquipment([...equipment, customEquipment.trim()]);
      setCustomEquipment('');
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.post(
        'http://192.168.29.52:8000/api/ml/workout-plan/',
        {
          experience_level: experienceLevel,
          days_per_week: daysPerWeek,
          equipment: equipment,
          goal: goal,
          food_preference: foodPreference,
          avg_steps: parseInt(avgSteps),
          avg_sleep: parseFloat(avgSleep),
          spo2: parseInt(spo2),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setWorkoutPlan(response.data.workout_plan);
      }
    } catch (error) {
      console.error('Workout plan error:', error);
      Alert.alert('Error', 'Failed to generate workout plan');
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>AI Workout Plan</Text>
        </View>

        {!workoutPlan ? (
          <View>
            {/* Input Form */}
            <View style={[styles.card, { backgroundColor: 'transparent', borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Fitness Goal</Text>
              <View style={styles.buttonGroup}>
                {goalOptions.map((g) => (
                  <TouchableOpacity
                    key={g.key}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: goal === g.key ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setGoal(g.key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: goal === g.key ? '#fff' : colors.textPrimary },
                      ]}
                    >
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>Food Preference</Text>
              <View style={styles.buttonGroup}>
                {foodOptions.map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: foodPreference === f.key ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setFoodPreference(f.key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: foodPreference === f.key ? '#fff' : colors.textPrimary },
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Average Daily Steps
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardGlass }]}
                value={avgSteps}
                onChangeText={setAvgSteps}
                keyboardType="numeric"
                placeholder="e.g., 8000"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Average Sleep (hours)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardGlass }]}
                value={avgSleep}
                onChangeText={setAvgSleep}
                keyboardType="decimal-pad"
                placeholder="e.g., 7"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                SpO2 Level (%)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardGlass }]}
                value={spo2}
                onChangeText={setSpo2}
                keyboardType="numeric"
                placeholder="e.g., 98"
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
                Days Per Week
              </Text>
              <View style={styles.buttonGroup}>
                {[3, 4, 5, 6].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.dayButton,
                      {
                        backgroundColor: daysPerWeek === days ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setDaysPerWeek(days)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: daysPerWeek === days ? '#fff' : colors.textPrimary },
                      ]}
                    >
                      {days}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
                Available Equipment
              </Text>
              <View style={styles.equipmentGrid}>
                {equipmentOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.equipmentButton,
                      {
                        backgroundColor: equipment.includes(item) ? colors.success + '40' : colors.cardGlass,
                        borderColor: equipment.includes(item) ? colors.success : colors.border,
                      },
                    ]}
                    onPress={() => toggleEquipment(item)}
                  >
                    <Icon
                      name={equipment.includes(item) ? 'check-circle' : 'circle-outline'}
                      size={20}
                      color={equipment.includes(item) ? colors.success : colors.textTertiary}
                    />
                    <Text style={[styles.equipmentText, { color: colors.textPrimary }]}>
                      {item.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
                Add Your Own Equipment
              </Text>
              <View style={styles.customEquipmentRow}>
                <TextInput
                  style={[styles.customInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardGlass }]}
                  value={customEquipment}
                  onChangeText={setCustomEquipment}
                  placeholder="e.g., medicine ball"
                  placeholderTextColor={colors.textTertiary}
                />
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.accent }]}
                  onPress={addCustomEquipment}
                >
                  <Icon name="plus" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              {equipment.filter(e => !equipmentOptions.includes(e)).length > 0 && (
                <View style={styles.customEquipmentList}>
                  {equipment.filter(e => !equipmentOptions.includes(e)).map((item, idx) => (
                    <View key={idx} style={[styles.customChip, { backgroundColor: colors.success + '40', borderColor: colors.success }]}>
                      <Text style={[styles.customChipText, { color: colors.textPrimary }]}>{item}</Text>
                      <TouchableOpacity onPress={() => setEquipment(equipment.filter(e => e !== item))}>
                        <Icon name="close-circle" size={18} color={colors.success} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.accent }]}
                onPress={generatePlan}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.generateButtonText}>Generate Workout Plan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {/* Workout Plan Results */}
            <View style={[styles.card, { backgroundColor: 'transparent', borderColor: colors.border }]}>
              <View style={styles.resultHeader}>
                <Icon name="dumbbell" size={32} color={colors.accent} />
                <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
                  Your Personalized Workout Plan
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Type</Text>
                  <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                    {workoutPlan.type}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Days/Week</Text>
                  <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                    {workoutPlan.days_per_week}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Level</Text>
                  <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                    {workoutPlan.experience_level}
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Exercises</Text>
              {workoutPlan.exercises.map((exercise, idx) => (
                <View key={idx} style={[styles.exerciseCard, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}>
                  <View style={styles.exerciseHeader}>
                    <Icon name="fitness" size={20} color={colors.accent} />
                    <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>
                      {exercise.name}
                    </Text>
                  </View>
                  <View style={styles.exerciseDetails}>
                    {exercise.sets && (
                      <Text style={[styles.exerciseDetail, { color: colors.textSecondary }]}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                    )}
                    {exercise.duration && (
                      <Text style={[styles.exerciseDetail, { color: colors.textSecondary }]}>
                        Duration: {exercise.duration}
                      </Text>
                    )}
                    <View style={[styles.intensityBadge, { 
                      backgroundColor: exercise.intensity === 'high' ? colors.error + '30' : 
                                      exercise.intensity === 'moderate' ? colors.warning + '30' : 
                                      colors.success + '30' 
                    }]}>
                      <Text style={[styles.intensityText, { 
                        color: exercise.intensity === 'high' ? colors.error : 
                               exercise.intensity === 'moderate' ? colors.warning : 
                               colors.success 
                      }]}>
                        {exercise.intensity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Schedule</Text>
              {workoutPlan.weekly_schedule.map((day, idx) => (
                <View key={idx} style={styles.scheduleItem}>
                  <Icon name="calendar-check" size={18} color={colors.accent} />
                  <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>
                    {day}
                  </Text>
                </View>
              ))}

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Tips</Text>
              {workoutPlan.tips.map((tip, idx) => (
                <Text key={idx} style={[styles.tip, { color: colors.textSecondary }]}>
                  • {tip}
                </Text>
              ))}

              <TouchableOpacity
                style={[styles.regenerateButton, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
                onPress={() => setWorkoutPlan(null)}
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
  dayButton: {
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
  equipmentGrid: {
    gap: 10,
  },
  equipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  customEquipmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customEquipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  customChipText: {
    fontSize: 13,
    fontWeight: '500',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    gap: 6,
  },
  exerciseDetail: {
    fontSize: 14,
  },
  intensityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 14,
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

export default WorkoutPlanScreen;
