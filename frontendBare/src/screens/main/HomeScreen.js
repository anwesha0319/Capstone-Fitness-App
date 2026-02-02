import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle, getIconContainerStyle } from '../../utils/styleHelpers';
import { saveWeightGoal, getWeightGoal, getHealthData, getGoals, getTodayData } from '../../utils/storage';

const HomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [weightGoal, setWeightGoalState] = useState('70');
  const [currentWeight, setCurrentWeight] = useState('75');
  const [stepsGoal, setStepsGoal] = useState('10000');
  const [sleepHours, setSleepHours] = useState('0');
  const [todaySteps, setTodaySteps] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayDistance, setTodayDistance] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [todayWater, setTodayWater] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');

  useEffect(() => {
    loadUserData();
    loadHealthData();
    updateGreeting();
  }, []);

  const loadHealthData = async () => {
    const healthData = await getHealthData();
    const goals = await getGoals();
    const goal = await getWeightGoal();
    const todayData = await getTodayData();
    
    setCurrentWeight(todayData.weight?.toString() || healthData.weight);
    setWeightGoalState(goal);
    setStepsGoal(goals.stepsGoal);
    setSleepHours(todayData.sleep?.toString() || '0');
    setTodaySteps(todayData.steps || 0);
    setTodayCalories(todayData.calories || 0);
    setTodayDistance(todayData.distance || 0);
    setTodayMinutes(todayData.minutes || 0);
    setTodayWater(todayData.water || 0);
    setHeartRate(todayData.heartRate || 0);
    
    if (healthData.height && currentWeight) {
      const heightInMeters = healthData.height / 100;
      const bmiValue = parseFloat(currentWeight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Morning');
    else if (hour < 18) setGreeting('Afternoon');
    else setGreeting('Evening');
  };

  const handleSaveGoal = async () => {
    if (newGoalInput && !isNaN(newGoalInput)) {
      await saveWeightGoal(newGoalInput);
      setWeightGoalState(newGoalInput);
      setShowGoalModal(false);
      setNewGoalInput('');
      Alert.alert('Success', `Weight goal set to ${newGoalInput} kg`);
    } else {
      Alert.alert('Error', 'Please enter a valid number');
    }
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={getTypographyStyle(colors, 'h1')}>
            Good {greeting}, {user?.first_name || 'User'}!
          </Text>
          <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
            Let's crush your fitness goals today
          </Text>
        </View>

        {/* Health Connect Sync Button */}
        <TouchableOpacity 
          onPress={() => Alert.alert('Health Connect', 'Sync with Health Connect to import your health data from other apps and devices.\n\nFeatures:\n• Auto-sync steps, sleep, heart rate\n• Import workout data\n• Sync nutrition logs\n• Connect wearable devices\n\nComing soon!')}
        >
          <GlassCard variant="primary" style={styles.healthConnectButton}>
            <View style={styles.healthConnectRow}>
              <View style={getIconContainerStyle(colors, 'medium', colors.accent)}>
                <Icon name="sync" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.healthConnectContent}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  Sync with Health Connect
                </Text>
                <Text style={getTypographyStyle(colors, 'caption')}>
                  Import data from other apps
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.accent} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Today's Stats */}
        <Text style={[getTypographyStyle(colors, 'h2'), styles.sectionTitle]}>
          Today's Stats
        </Text>

        <GlassCard variant="primary">
          {/* Running Icon */}
          <View style={[styles.runningIconContainer, { backgroundColor: colors.accent }]}>
            <Icon name="run" size={80} color="#FFFFFF" />
          </View>
          
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={getTypographyStyle(colors, 'h1')}>{todaySteps.toLocaleString()}</Text>
              <Text style={getTypographyStyle(colors, 'label')}>Steps</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={getTypographyStyle(colors, 'h1')}>{todayCalories}</Text>
              <Text style={getTypographyStyle(colors, 'label')}>Cals Burnt</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={getTypographyStyle(colors, 'h1')}>{todayDistance.toFixed(2)}</Text>
              <Text style={getTypographyStyle(colors, 'label')}>Kms</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={getTypographyStyle(colors, 'h1')}>{todayMinutes}</Text>
              <Text style={getTypographyStyle(colors, 'label')}>Minutes</Text>
            </View>
          </View>
          
          {/* Daily Steps Goal */}
          <View style={[styles.goalRow, { borderTopColor: colors.divider }]}>
            <Text style={getTypographyStyle(colors, 'label')}>Daily Steps Goal:</Text>
            <Text style={getTypographyStyle(colors, 'bodyMedium')}>{stepsGoal} steps</Text>
          </View>
        </GlassCard>

        {/* Weight Tracking */}
        <GlassCard variant="primary" style={styles.weightCard}>
          <Text style={getTypographyStyle(colors, 'h2')}>Weight Tracking</Text>
          
          <View style={styles.weightContent}>
            <View>
              <Text style={getTypographyStyle(colors, 'label')}>Current Weight</Text>
              <View style={styles.weightValueRow}>
                <Text style={[getTypographyStyle(colors, 'h1'), { fontSize: 36 }]}>{currentWeight}</Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginLeft: 6 }]}>kg</Text>
              </View>
            </View>
            
            {weightGoal && (
              <View style={styles.goalWeightSection}>
                <Text style={getTypographyStyle(colors, 'label')}>Goal Weight</Text>
                <View style={styles.weightValueRow}>
                  <Text style={[getTypographyStyle(colors, 'h2'), { fontSize: 24 }]}>{weightGoal}</Text>
                  <Text style={[getTypographyStyle(colors, 'caption'), { marginLeft: 4 }]}>kg</Text>
                </View>
              </View>
            )}
          </View>
          
          <GlassButton
            variant="primary"
            size="medium"
            onPress={() => {
              setNewGoalInput(weightGoal);
              setShowGoalModal(true);
            }}
            icon={<Icon name="target" size={20} color="#FFF" />}
          >
            Set New Goal
          </GlassButton>
        </GlassCard>

        {/* Health Metrics Grid */}
        <View style={styles.metricsGrid}>
          <GlassCard variant="primary" style={styles.metricCard}>
            <Icon name="heart-pulse" size={32} color={colors.iconHeart} />
            <Text style={getTypographyStyle(colors, 'h1')}>{heartRate || 0}</Text>
            <Text style={getTypographyStyle(colors, 'label')}>Heart Rate</Text>
          </GlassCard>

          <GlassCard variant="primary" style={styles.metricCard}>
            <Icon name="sleep" size={32} color={colors.iconSleep} />
            <Text style={getTypographyStyle(colors, 'h1')}>{sleepHours}h</Text>
            <Text style={getTypographyStyle(colors, 'label')}>Sleep</Text>
          </GlassCard>

          <GlassCard variant="primary" style={styles.metricCard}>
            <Icon name="water" size={32} color={colors.iconWater} />
            <Text style={getTypographyStyle(colors, 'h1')}>{todayWater.toFixed(1)}L</Text>
            <Text style={getTypographyStyle(colors, 'label')}>Water Intake</Text>
          </GlassCard>
          
          <GlassCard variant="primary" style={styles.metricCard}>
            <Icon name="human-male-height" size={32} color={colors.success} />
            <Text style={getTypographyStyle(colors, 'h1')}>{bmi || 0}</Text>
            <Text style={getTypographyStyle(colors, 'label')}>BMI</Text>
          </GlassCard>
        </View>

        {/* Recommendations */}
        <Text style={[getTypographyStyle(colors, 'h2'), styles.sectionTitle]}>
          Recommendations
        </Text>

        <View style={styles.recommendationsRow}>
          <TouchableOpacity style={styles.recommendCard} onPress={() => navigation.navigate('DietPlan')}>
            <GlassCard variant="nested" style={styles.recommendCardInner}>
              <Icon name="food-apple" size={32} color={isDark ? colors.iconApple : '#10B981'} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), { fontSize: 13 }]}>Diet Plan</Text>
              <Text style={[getTypographyStyle(colors, 'caption'), { fontSize: 11, textAlign: 'center', marginTop: 4 }]}>AI nutrition</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendCard} onPress={() => navigation.navigate('WorkoutPlan')}>
            <GlassCard variant="nested" style={styles.recommendCardInner}>
              <Icon name="dumbbell" size={32} color={isDark ? colors.iconDumbbell : '#8B5CF6'} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), { fontSize: 13 }]}>Workout</Text>
              <Text style={[getTypographyStyle(colors, 'caption'), { fontSize: 11, textAlign: 'center', marginTop: 4 }]}>Custom plan</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendCard} onPress={() => navigation.navigate('MarathonPlan')}>
            <GlassCard variant="nested" style={styles.recommendCardInner}>
              <Icon name="run-fast" size={32} color={isDark ? colors.accent : '#8B5CF6'} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), { fontSize: 13 }]}>Marathon</Text>
              <Text style={[getTypographyStyle(colors, 'caption'), { fontSize: 11, textAlign: 'center', marginTop: 4 }]}>Race prep</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Discover Section */}
        <Text style={[getTypographyStyle(colors, 'h2'), styles.sectionTitle]}>
          Discover
        </Text>

        <TouchableOpacity onPress={() => Alert.alert('Article', '10 Tips for Better Sleep Quality\n\n1. Maintain consistent sleep schedule\n2. Create relaxing bedtime routine\n3. Keep bedroom cool and dark\n4. Limit screen time before bed\n5. Avoid caffeine after 2 PM\n6. Exercise regularly\n7. Manage stress\n8. Comfortable mattress\n9. Limit daytime naps\n10. Avoid heavy meals before bed')}>
          <GlassCard variant="primary" style={styles.articleCard}>
            <View style={styles.articleHeader}>
              <View style={[styles.articleIcon, { backgroundColor: '#9C27B0' }]}>
                <Icon name="sleep" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  10 Tips for Better Sleep Quality
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
                  Discover science-backed methods to improve your sleep and wake up refreshed...
                </Text>
              </View>
            </View>
            <Text style={[getTypographyStyle(colors, 'accent'), { marginTop: 8 }]}>Read More →</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Article', 'Nutrition Guide for Muscle Building\n\nKey Points:\n• Protein: 1.6-2.2g per kg body weight\n• Eat every 3-4 hours\n• Complex carbs for energy\n• Healthy fats for hormones\n• Stay hydrated\n• Post-workout nutrition\n• Meal prep for consistency\n• Track your macros\n• Quality over quantity\n• Consistency is key')}>
          <GlassCard variant="primary" style={styles.articleCard}>
            <View style={styles.articleHeader}>
              <View style={[styles.articleIcon, { backgroundColor: '#FF6B6B' }]}>
                <Icon name="food-steak" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  Nutrition Guide for Muscle Building
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
                  Learn what to eat to maximize muscle growth and recovery...
                </Text>
              </View>
            </View>
            <Text style={[getTypographyStyle(colors, 'accent'), { marginTop: 8 }]}>Read More →</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Article', 'Cardio vs Strength Training\n\nCardio Benefits:\n• Heart health\n• Calorie burning\n• Endurance\n• Stress relief\n\nStrength Benefits:\n• Muscle building\n• Bone density\n• Metabolism boost\n• Injury prevention\n\nBest Approach: Combine both for optimal fitness!')}>
          <GlassCard variant="primary" style={styles.articleCard}>
            <View style={styles.articleHeader}>
              <View style={[styles.articleIcon, { backgroundColor: '#4CAF50' }]}>
                <Icon name="dumbbell" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  Cardio vs Strength Training
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
                  Understanding the benefits of each and how to balance them...
                </Text>
              </View>
            </View>
            <Text style={[getTypographyStyle(colors, 'accent'), { marginTop: 8 }]}>Read More →</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Article', 'Hydration: The Forgotten Nutrient\n\nWhy Water Matters:\n• 60% of your body is water\n• Regulates temperature\n• Transports nutrients\n• Removes waste\n• Lubricates joints\n• Improves performance\n\nDaily Goal: 8-10 glasses or 2-3 liters\n\nTip: Drink before you feel thirsty!')}>
          <GlassCard variant="primary" style={styles.articleCard}>
            <View style={styles.articleHeader}>
              <View style={[styles.articleIcon, { backgroundColor: '#2196F3' }]}>
                <Icon name="water" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  Hydration: The Forgotten Nutrient
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
                  Why drinking enough water is crucial for your fitness goals...
                </Text>
              </View>
            </View>
            <Text style={[getTypographyStyle(colors, 'accent'), { marginTop: 8 }]}>Read More →</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Article', 'Mental Health & Fitness Connection\n\nExercise Benefits:\n• Reduces anxiety & depression\n• Boosts mood & confidence\n• Improves sleep quality\n• Enhances brain function\n• Reduces stress hormones\n• Increases endorphins\n\nRemember: Physical and mental health go hand in hand!')}>
          <GlassCard variant="primary" style={styles.articleCard}>
            <View style={styles.articleHeader}>
              <View style={[styles.articleIcon, { backgroundColor: '#FF9800' }]}>
                <Icon name="brain" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                  Mental Health & Fitness Connection
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 4 }]}>
                  How exercise improves your mental wellbeing and mood...
                </Text>
              </View>
            </View>
            <Text style={[getTypographyStyle(colors, 'accent'), { marginTop: 8 }]}>Read More →</Text>
          </GlassCard>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={[getTypographyStyle(colors, 'caption'), { textAlign: 'center', marginTop: 20 }]}>
          +91 2345678900  |  support@fitwell.com
        </Text>
        <Text style={[getTypographyStyle(colors, 'caption'), { textAlign: 'center', marginTop: 10, marginBottom: 40 }]}>
          © 2026 FitWell. All rights reserved.
        </Text>
      </ScrollView>

      {/* Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1A2F3A' : '#FFFFFF' }]}>
            <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
              Set Weight Goal
            </Text>
            <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginTop: 8, marginBottom: 20 }]}>
              Enter your target weight (kg)
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                color: colors.textPrimary, 
                borderColor: colors.cardBorder, 
                backgroundColor: isDark ? '#2A3F4A' : '#F5F5F5'
              }]}
              value={newGoalInput}
              onChangeText={setNewGoalInput}
              keyboardType="numeric"
              placeholder="Enter weight in kg"
              placeholderTextColor={colors.textPlaceholder}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <GlassButton
                variant="secondary"
                size="medium"
                onPress={() => {
                  setShowGoalModal(false);
                  setNewGoalInput('');
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                size="medium"
                onPress={handleSaveGoal}
                style={{ flex: 1 }}
                icon={<Icon name="check" size={20} color="#FFF" />}
              >
                Save
              </GlassButton>
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  healthConnectButton: {
    marginBottom: 24,
  },
  healthConnectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthConnectContent: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  runningIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    alignSelf: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  weightCard: {
    marginTop: 20,
  },
  weightContent: {
    marginVertical: 20,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  goalWeightSection: {
    marginTop: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  metricCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  recommendationsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  recommendCard: {
    flex: 1,
  },
  recommendCardInner: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  articleCard: {
    marginBottom: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  articleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default HomeScreen;
