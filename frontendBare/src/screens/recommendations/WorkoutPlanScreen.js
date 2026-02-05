import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { generateDailyWorkout, getTodaysWorkout, completeDailyWorkout, trackWorkoutExercise } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutPlanScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // Form inputs
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'general_fitness',
    avgSteps: '5000',
    sleepHours: '7',
    spo2: '98',
    fitnessLevel: 'intermediate'
  });

  useEffect(() => {
    loadUserProfile();
    loadTodaysWorkout();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const today = new Date();
        const birthDate = new Date(user.date_of_birth);
        const age = today.getFullYear() - birthDate.getFullYear();
        
        setFormData(prev => ({
          ...prev,
          age: age.toString(),
          weight: user.weight?.toString() || '',
          height: user.height?.toString() || '',
          goal: user.fitness_goal || 'general_fitness'
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadTodaysWorkout = async () => {
    try {
      const result = await getTodaysWorkout();
      if (result.has_workout) {
        setTodaysWorkout(result.workout);
      } else {
        setTodaysWorkout(null);
      }
    } catch (error) {
      console.error('Error loading workout:', error);
      setTodaysWorkout(null);
    }
  };

  const handleGenerateWorkout = async () => {
    if (!formData.age || !formData.weight || !formData.height) {
      Alert.alert('Missing Information', 'Please fill in your age, weight, and height');
      return;
    }

    setLoading(true);
    setShowInputForm(false);
    
    try {
      const response = await generateDailyWorkout({
        fitness_level: formData.fitnessLevel,
        goal: formData.goal,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        avg_steps: parseInt(formData.avgSteps),
        sleep_hours: parseFloat(formData.sleepHours),
        spo2: parseInt(formData.spo2)
      });
      
      if (response.success && response.workout) {
        setTodaysWorkout(response.workout);
        Alert.alert('Success', `Day ${response.workout.day_number} workout generated!`);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseToggle = async (exerciseIndex) => {
    if (!todaysWorkout) return;
    
    try {
      await trackWorkoutExercise(todaysWorkout.id, exerciseIndex, true);
      
      // Update local state
      const updatedExercises = [...todaysWorkout.exercises];
      updatedExercises[exerciseIndex].completed = !updatedExercises[exerciseIndex].completed;
      
      setTodaysWorkout({
        ...todaysWorkout,
        exercises: updatedExercises
      });
      
      // Check if all completed
      const allCompleted = updatedExercises.every(e => e.completed);
      if (allCompleted && !todaysWorkout.has_feedback) {
        setShowFeedbackModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update exercise');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedFeedback || !todaysWorkout) return;
    
    try {
      await completeDailyWorkout(todaysWorkout.id, selectedFeedback);
      setShowFeedbackModal(false);
      
      Alert.alert(
        'Great Job!',
        `Tomorrow's workout will be adjusted based on your feedback. Come back tomorrow for Day ${todaysWorkout.day_number + 1}!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save feedback');
    }
  };

  const getWorkoutIcon = (workoutType) => {
    const iconMap = {
      'cardio': 'run',
      'strength': 'dumbbell',
      'flexibility': 'yoga',
      'hiit': 'lightning-bolt',
      'yoga': 'meditation',
      'core': 'ab-testing',
      'general': 'weight-lifter'
    };
    return iconMap[workoutType?.toLowerCase()] || 'weight-lifter';
  };
  
  const getWorkoutColor = (workoutType) => {
    const colorMap = {
      'cardio': '#FF7043',
      'strength': '#42A5F5',
      'flexibility': '#66BB6A',
      'hiit': '#FFA726',
      'yoga': '#AB47BC',
      'core': '#26C6DA',
      'general': '#78909C'
    };
    return colorMap[workoutType?.toLowerCase()] || '#78909C';
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', info }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>{label}</Text>
      {info && <Text style={[styles.inputInfo, { color: colors.textTertiary }]}>{info}</Text>}
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardGlass, color: colors.textPrimary, borderColor: colors.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
      />
    </View>
  );

  const SelectField = ({ label, value, options, onSelect, info }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>{label}</Text>
      {info && <Text style={[styles.inputInfo, { color: colors.textTertiary }]}>{info}</Text>}
      <View style={styles.selectRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectOption,
              { 
                backgroundColor: value === option.value ? colors.accent : colors.cardGlass,
                borderColor: value === option.value ? colors.accent : colors.border
              }
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[styles.selectOptionText, { color: value === option.value ? '#FFF' : colors.textPrimary }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={isDark ? [colors.backgroundStart, colors.backgroundMid, colors.backgroundEnd] : [colors.backgroundStart, colors.backgroundMid, colors.backgroundEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Daily Workout</Text>
        </View>

        {!todaysWorkout ? (
          <View style={styles.emptyState}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
              <Icon name="dumbbell" size={64} color={colors.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Generate Today's Workout</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Get a personalized workout for today. Complete it and provide feedback to get tomorrow's workout adjusted to your level!
            </Text>
            
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowInputForm(true)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="sparkles" size={20} color="#FFF" />
                  <Text style={styles.generateButtonText}>Generate Today's Workout</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>DAY {todaysWorkout.day_number}</Text>
              </View>
              <Text style={[styles.planTitle, { color: colors.textPrimary }]}>{todaysWorkout.workout_name}</Text>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#FF7043' + '20' }]}>
                    <Icon name="fire" size={24} color="#FF7043" />
                  </View>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{todaysWorkout.total_calories}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Calories</Text>
                </View>

                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#42A5F5' + '20' }]}>
                    <Icon name="clock-outline" size={24} color="#42A5F5" />
                  </View>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{todaysWorkout.total_duration}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Minutes</Text>
                </View>

                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#66BB6A' + '20' }]}>
                    <Icon name="format-list-numbered" size={24} color="#66BB6A" />
                  </View>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{todaysWorkout.exercises.length}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Exercises</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Exercises</Text>
            
            {todaysWorkout.exercises.map((exercise, index) => {
              const workoutColor = getWorkoutColor(exercise.workout_type);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.exerciseCard,
                    { 
                      backgroundColor: colors.card,
                      borderColor: exercise.completed ? colors.success : colors.border,
                      borderWidth: exercise.completed ? 2 : 1
                    }
                  ]}
                  onPress={() => handleExerciseToggle(index)}
                  disabled={todaysWorkout.has_feedback}
                >
                  <View style={styles.exerciseHeader}>
                    <View style={[styles.checkbox, { borderColor: exercise.completed ? colors.success : colors.border }]}>
                      {exercise.completed && <Icon name="check" size={20} color={colors.success} />}
                    </View>
                    <View style={[styles.exerciseIcon, { backgroundColor: workoutColor + '20' }]}>
                      <Icon name={getWorkoutIcon(exercise.workout_type)} size={24} color={workoutColor} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: colors.textPrimary, textDecorationLine: exercise.completed ? 'line-through' : 'none' }]}>
                        {exercise.name}
                      </Text>
                      <Text style={[styles.exerciseReps, { color: colors.textSecondary }]}>{exercise.reps_or_duration}</Text>
                      <Text style={[styles.exerciseType, { color: workoutColor }]}>
                        {exercise.workout_type?.toUpperCase() || 'GENERAL'}
                      </Text>
                    </View>
                    <View style={[styles.caloriesBadge, { backgroundColor: '#FF7043' + '20' }]}>
                      <Icon name="fire" size={16} color="#FF7043" />
                      <Text style={[styles.caloriesText, { color: '#FF7043' }]}>{exercise.calories}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {todaysWorkout.has_feedback && (
              <View style={[styles.feedbackCard, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
                <Icon name="check-circle" size={48} color={colors.success} />
                <Text style={[styles.feedbackTitle, { color: colors.textPrimary }]}>Workout Completed!</Text>
                <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
                  Great job! Come back tomorrow for Day {todaysWorkout.day_number + 1}
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Input Form Modal */}
      <Modal visible={showInputForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#182E3D' : '#E8F0EE' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Workout Details</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Provide your information for today's personalized workout
              </Text>

              <InputField
                label="Age"
                value={formData.age}
                onChangeText={(text) => setFormData({...formData, age: text})}
                placeholder="25"
                keyboardType="numeric"
                info="From your profile"
              />

              <InputField
                label="Weight (kg)"
                value={formData.weight}
                onChangeText={(text) => setFormData({...formData, weight: text})}
                placeholder="70"
                keyboardType="numeric"
                info="From your profile"
              />

              <InputField
                label="Height (cm)"
                value={formData.height}
                onChangeText={(text) => setFormData({...formData, height: text})}
                placeholder="175"
                keyboardType="numeric"
                info="From your profile"
              />

              <SelectField
                label="Fitness Goal"
                value={formData.goal}
                options={[
                  { label: 'Lose Weight', value: 'lose_weight' },
                  { label: 'Build Muscle', value: 'gain_muscle' },
                  { label: 'General Fitness', value: 'general_fitness' },
                  { label: 'Endurance', value: 'improve_endurance' }
                ]}
                onSelect={(value) => setFormData({...formData, goal: value})}
                info="From your profile"
              />

              <SelectField
                label="Fitness Level"
                value={formData.fitnessLevel}
                options={[
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' }
                ]}
                onSelect={(value) => setFormData({...formData, fitnessLevel: value})}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.cardGlass, borderWidth: 1, borderColor: colors.border }]}
                  onPress={() => setShowInputForm(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.accent }]}
                  onPress={handleGenerateWorkout}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Generate</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal visible={showFeedbackModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackModalContent, { backgroundColor: isDark ? '#182E3D' : '#E8F0EE' }]}>
            <Text style={[styles.feedbackModalTitle, { color: colors.textPrimary }]}>How was today's workout?</Text>
            <Text style={[styles.feedbackModalSubtitle, { color: colors.textSecondary }]}>
              Your feedback helps us adjust tomorrow's workout
            </Text>
            
            <TouchableOpacity
              style={[
                styles.feedbackOption,
                { 
                  backgroundColor: selectedFeedback === 'easy' ? colors.success + '20' : colors.cardGlass,
                  borderColor: selectedFeedback === 'easy' ? colors.success : colors.border
                }
              ]}
              onPress={() => setSelectedFeedback('easy')}
            >
              <Text style={styles.feedbackEmoji}>😊</Text>
              <Text style={[styles.feedbackOptionTitle, { color: colors.textPrimary }]}>Too Easy</Text>
              <Text style={[styles.feedbackOptionDesc, { color: colors.textSecondary }]}>I can do more!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackOption,
                { 
                  backgroundColor: selectedFeedback === 'just_right' ? colors.accent + '20' : colors.cardGlass,
                  borderColor: selectedFeedback === 'just_right' ? colors.accent : colors.border
                }
              ]}
              onPress={() => setSelectedFeedback('just_right')}
            >
              <Text style={styles.feedbackEmoji}>👍</Text>
              <Text style={[styles.feedbackOptionTitle, { color: colors.textPrimary }]}>Just Right</Text>
              <Text style={[styles.feedbackOptionDesc, { color: colors.textSecondary }]}>Perfect challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackOption,
                { 
                  backgroundColor: selectedFeedback === 'difficult' ? colors.warning + '20' : colors.cardGlass,
                  borderColor: selectedFeedback === 'difficult' ? colors.warning : colors.border
                }
              ]}
              onPress={() => setSelectedFeedback('difficult')}
            >
              <Text style={styles.feedbackEmoji}>😓</Text>
              <Text style={[styles.feedbackOptionTitle, { color: colors.textPrimary }]}>Too Hard</Text>
              <Text style={[styles.feedbackOptionDesc, { color: colors.textSecondary }]}>Need easier workout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitFeedbackButton, { backgroundColor: colors.accent, opacity: selectedFeedback ? 1 : 0.5 }]}
              onPress={handleSubmitFeedback}
              disabled={!selectedFeedback}
            >
              <Text style={styles.submitFeedbackText}>Submit & Generate Tomorrow's Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { marginRight: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, textAlign: 'center', marginBottom: 32, paddingHorizontal: 20, lineHeight: 22 },
  generateButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 25, gap: 10 },
  generateButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  card: { padding: 24, borderRadius: 20, marginBottom: 20, borderWidth: 1 },
  dayBadge: { alignSelf: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
  dayBadgeText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  planTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', gap: 8 },
  summaryIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: 'bold' },
  summaryLabel: { fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  exerciseCard: { padding: 16, borderRadius: 16, marginBottom: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  exerciseIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  exerciseReps: { fontSize: 14, marginBottom: 2 },
  exerciseType: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  caloriesBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 4 },
  caloriesText: { fontSize: 14, fontWeight: '600' },
  feedbackCard: { padding: 24, borderRadius: 20, marginTop: 20, borderWidth: 2, alignItems: 'center', gap: 12 },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold' },
  feedbackText: { fontSize: 15, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  inputInfo: { fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  selectRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  selectOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  selectOptionText: { fontSize: 14, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalButtonText: { fontSize: 16, fontWeight: 'bold' },
  feedbackModalContent: { borderRadius: 24, padding: 24, margin: 20 },
  feedbackModalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  feedbackModalSubtitle: { fontSize: 14, marginBottom: 24, textAlign: 'center' },
  feedbackOption: { padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 2, alignItems: 'center' },
  feedbackEmoji: { fontSize: 48, marginBottom: 8 },
  feedbackOptionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  feedbackOptionDesc: { fontSize: 14 },
  submitFeedbackButton: { padding: 16, borderRadius: 12, marginTop: 12 },
  submitFeedbackText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default WorkoutPlanScreen;
