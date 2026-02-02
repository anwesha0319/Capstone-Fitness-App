import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveWeightGoal, getWeightGoal, getHealthData, getGoals, getTodayData } from '../../utils/storage';

const { width } = Dimensions.get('window');

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
  const scrollViewRef = React.useRef(null);
  
  const weightRef = React.useRef(null);
  const metricsRef = React.useRef(null);
  const recommendationsRef = React.useRef(null);
  
  // Blur settings from theme
  const blurAmount = colors.blurAmount || 32;
  const blurFallback = colors.card;

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
    
    // Load synced data from today's data - NO DUMMY DATA
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
    
    // Calculate BMI if height and weight available
    if (healthData.height && currentWeight) {
      const heightInMeters = healthData.height / 100;
      const bmiValue = parseFloat(currentWeight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    } else {
      setBmi(0);
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

  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || user.email?.charAt(0)?.toUpperCase() || 'U';
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
    <LinearGradient
      colors={isDark ? [colors.backgroundStart, colors.backgroundMid, colors.backgroundEnd] : [colors.backgroundStart, colors.backgroundMid, colors.backgroundEnd]}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>
            Good {greeting}, {user?.first_name || 'User'}!
          </Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Let's crush your fitness goals today
          </Text>
        </View>

        {/* Health Connect Sync Button - Glass Effect */}
        <TouchableOpacity 
          style={[styles.healthConnectButton, { borderColor: colors.accent }]}
          onPress={() => Alert.alert('Health Connect', 'Sync with Health Connect to import your health data from other apps and devices.\n\nFeatures:\n• Auto-sync steps, sleep, heart rate\n• Import workout data\n• Sync nutrition logs\n• Connect wearable devices\n\nComing soon!')}
        >
          <BlurView
            style={styles.blurContainer}
            blurType={isDark ? 'dark' : 'light'}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={blurFallback}
          >
            <View style={styles.healthConnectRow}>
              <View style={[styles.healthConnectIcon, { backgroundColor: colors.accent }]}>
                <Icon name="sync" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.healthConnectContent}>
                <Text style={[styles.healthConnectTitle, { color: colors.textPrimary }]}>
                  Sync with Health Connect
                </Text>
                <Text style={[styles.healthConnectSubtitle, { color: colors.textSecondary }]}>
                  Import data from other apps
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.accent} />
            </View>
          </BlurView>
        </TouchableOpacity>

        {/* Today's Stats */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's stats</Text>
        </View>

        <View style={[styles.todayStatsCard, { 
          borderColor: colors.cardBorder,
        }]}>
          <BlurView
            style={styles.blurContainer}
            blurType={isDark ? 'dark' : 'light'}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={blurFallback}
          >
            {/* Running Person Icon - Solid Purple */}
            <View style={[styles.runningIconContainer, { backgroundColor: colors.accent }]}>
              <Icon name="run" size={80} color="#FFFFFF" />
            </View>
            
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {/* Steps */}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{todaySteps.toLocaleString()}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Steps</Text>
              </View>

              {/* Calories Burnt */}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{todayCalories}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cals Burnt</Text>
              </View>

              {/* Kilometres */}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{todayDistance.toFixed(2)}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Kms</Text>
              </View>

              {/* Minutes */}
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{todayMinutes}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Minutes</Text>
              </View>
            </View>
            
            {/* Daily Steps Goal */}
            <View style={[styles.goalRowInline, { borderTopColor: colors.border }]}>
              <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Daily Steps Goal:</Text>
              <Text style={[styles.goalValue, { color: colors.textPrimary }]}>{stepsGoal} steps</Text>
            </View>
          </BlurView>
        </View>

        {/* Weight Tracking */}
        <View 
          ref={weightRef}
          style={[styles.weightCard, { 
            borderColor: colors.cardBorder,
          }]}
        >
          <BlurView
            style={styles.blurContainer}
            blurType={isDark ? 'dark' : 'light'}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={blurFallback}
          >
            <Text style={[styles.weightTitle, { color: colors.textPrimary }]}>Weight Tracking</Text>
            
            <View style={styles.weightContent}>
              <View>
                <Text style={[styles.weightLabel, { color: colors.textSecondary }]}>Current Weight</Text>
                <View style={styles.weightValueRow}>
                  <Text style={[styles.weightValueLarge, { color: colors.textPrimary }]}>{currentWeight}</Text>
                  <Text style={[styles.weightUnit, { color: colors.textSecondary }]}>kg</Text>
                </View>
              </View>
              
              {weightGoal && (
                <View style={styles.goalWeightSection}>
                  <Text style={[styles.weightLabel, { color: colors.textSecondary }]}>Goal Weight</Text>
                  <View style={styles.weightValueRow}>
                    <Text style={[styles.goalWeightValue, { color: colors.textPrimary }]}>{weightGoal}</Text>
                    <Text style={[styles.weightUnitSmall, { color: colors.textSecondary }]}>kg</Text>
                  </View>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.setGoalButton, { backgroundColor: colors.accent }]}
              onPress={() => {
                setNewGoalInput(weightGoal);
                setShowGoalModal(true);
              }}
            >
              <Text style={styles.setGoalButtonText}>Set New Goal</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Goal Input Modal */}
        <Modal
          visible={showGoalModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowGoalModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? colors.backgroundStart : colors.backgroundStart }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Set Weight Goal</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Enter your target weight (kg)</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardGlass }]}
                value={newGoalInput}
                onChangeText={setNewGoalInput}
                keyboardType="numeric"
                placeholder="Enter weight in kg"
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
                  onPress={() => {
                    setShowGoalModal(false);
                    setNewGoalInput('');
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.accent }]}
                  onPress={handleSaveGoal}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Health Metrics Grid */}
        <View ref={metricsRef} style={styles.metricsGrid}>
          {/* Heart Rate */}
          <View style={[styles.metricCard, { 
            borderColor: colors.cardBorder,
          }]}>
            <BlurView
              style={styles.blurContainer}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={blurFallback}
            >
              <View style={[styles.metricIcon, { backgroundColor: colors.error + '30' }]}>
                <Icon name="heart-pulse" size={24} color={colors.error} />
              </View>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{heartRate || 0}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Heart Rate</Text>
            </BlurView>
          </View>

          {/* Sleep */}
          <View style={[styles.metricCard, { 
            borderColor: colors.cardBorder,
          }]}>
            <BlurView
              style={styles.blurContainer}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={blurFallback}
            >
              <View style={[styles.metricIcon, { backgroundColor: colors.purple + '30' }]}>
                <Icon name="sleep" size={24} color={colors.purple} />
              </View>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{sleepHours}h</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Sleep</Text>
            </BlurView>
          </View>

          {/* Water */}
          <View style={[styles.metricCard, { 
            borderColor: colors.cardBorder,
          }]}>
            <BlurView
              style={styles.blurContainer}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={blurFallback}
            >
              <View style={[styles.metricIcon, { backgroundColor: colors.accent + '30' }]}>
                <Icon name="water" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{todayWater.toFixed(1)}L</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Water Intake</Text>
            </BlurView>
          </View>
          
          {/* BMI */}
          <View style={[styles.metricCard, { 
            borderColor: colors.cardBorder,
          }]}>
            <BlurView
              style={styles.blurContainer}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={blurFallback}
            >
              <View style={[styles.metricIcon, { backgroundColor: colors.success + '30' }]}>
                <Icon name="human-male-height" size={24} color={colors.success} />
              </View>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{bmi || 0}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>BMI</Text>
            </BlurView>
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommendations</Text>
        </View>

        {/* Recommendation Buttons */}
        <View ref={recommendationsRef} style={styles.recommendationsRow}>
          <TouchableOpacity
            style={[styles.recommendCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DietPlan')}
          >
            <View style={[styles.recommendIcon, { backgroundColor: colors.success + '30' }]}>
              <Icon name="food-apple" size={28} color={colors.success} />
            </View>
            <Text style={[styles.recommendTitle, { color: colors.textPrimary }]}>Diet Plan</Text>
            <Text style={[styles.recommendSubtitle, { color: colors.textSecondary }]}>
              AI-powered nutrition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('WorkoutPlan')}
          >
            <View style={[styles.recommendIcon, { backgroundColor: colors.accent + '30' }]}>
              <Icon name="dumbbell" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.recommendTitle, { color: colors.textPrimary }]}>Workout</Text>
            <Text style={[styles.recommendSubtitle, { color: colors.textSecondary }]}>
              Custom exercises
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recommendCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('MarathonPlan')}
          >
            <View style={[styles.recommendIcon, { backgroundColor: colors.purple + '30' }]}>
              <Icon name="run-fast" size={28} color={colors.purple} />
            </View>
            <Text style={[styles.recommendTitle, { color: colors.textPrimary }]}>Marathon</Text>
            <Text style={[styles.recommendSubtitle, { color: colors.textSecondary }]}>
              Race preparation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Discover Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Discover</Text>
        </View>

        {/* Article Cards */}
        <TouchableOpacity 
          style={[styles.articleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Article', '10 Tips for Better Sleep Quality\n\n1. Maintain consistent sleep schedule\n2. Create relaxing bedtime routine\n3. Keep bedroom cool and dark\n4. Limit screen time before bed\n5. Avoid caffeine after 2 PM\n6. Exercise regularly\n7. Manage stress\n8. Comfortable mattress\n9. Limit daytime naps\n10. Avoid heavy meals before bed')}
        >
          <View style={styles.articleContent}>
            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
              10 Tips for Better Sleep Quality
            </Text>
            <Text style={[styles.articleExcerpt, { color: colors.textSecondary }]}>
              Discover science-backed methods to improve your sleep and wake up refreshed...
            </Text>
            <Text style={[styles.readMore, { color: colors.accent }]}>Read More →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.articleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Article', 'Heart Health: What Your BPM Tells You\n\nResting Heart Rate Zones:\n• 60-100 BPM: Normal\n• Below 60: Athletic/Excellent\n• Above 100: Consult doctor\n\nExercise Zones:\n• 50-60%: Warm-up\n• 60-70%: Fat burn\n• 70-80%: Cardio\n• 80-90%: Peak performance')}
        >
          <View style={styles.articleContent}>
            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
              Heart Health: What Your BPM Tells You
            </Text>
            <Text style={[styles.articleExcerpt, { color: colors.textSecondary }]}>
              Understanding your heart rate zones and what they mean for your fitness...
            </Text>
            <Text style={[styles.readMore, { color: colors.accent }]}>Read More →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.articleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Article', 'Nutrition Guide: Balanced Diet Basics\n\nKey Principles:\n• Eat variety of foods\n• Include fruits & vegetables\n• Choose whole grains\n• Lean proteins\n• Healthy fats\n• Stay hydrated\n• Control portions\n• Limit processed foods\n• Reduce sugar & salt\n• Plan your meals')}
        >
          <View style={styles.articleContent}>
            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
              Nutrition Guide: Balanced Diet Basics
            </Text>
            <Text style={[styles.articleExcerpt, { color: colors.textSecondary }]}>
              Learn how to create a balanced meal plan that supports your fitness goals...
            </Text>
            <Text style={[styles.readMore, { color: colors.accent }]}>Read More →</Text>
          </View>
        </TouchableOpacity>

        {/* Contact Footer */}
        <View style={styles.contactFooter}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            +91 2345678900  |  support@fitwell.com
          </Text>
        </View>

        {/* Copyright */}
        <Text style={[styles.copyright, { color: colors.textTertiary }]}>
          © 2026 FitWell. All rights reserved.
        </Text>

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
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  healthConnectButton: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  healthConnectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  healthConnectIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  healthConnectContent: {
    flex: 1,
  },
  healthConnectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  healthConnectSubtitle: {
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todayStatsCard: {
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
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
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subGreeting: {
    fontSize: 15,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalRowInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightCard: {
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  weightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
  },
  viewMore: {
    fontSize: 13,
    fontWeight: '600',
  },
  weightContent: {
    marginBottom: 16,
    padding: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  weightLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightValueLarge: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  weightUnit: {
    fontSize: 18,
    marginLeft: 6,
  },
  goalWeightSection: {
    marginTop: 12,
  },
  goalWeightValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weightUnitSmall: {
    fontSize: 14,
    marginLeft: 4,
  },
  setGoalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },
  setGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 52) / 2,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    marginBottom: 16,
  },
  articleCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  articleContent: {
    gap: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  recommendationsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  recommendCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  contactFooter: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  bottomSpace: {
    height: 20,
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
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;


