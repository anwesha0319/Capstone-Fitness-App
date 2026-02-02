import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { getHealthData } from '../../api/client';
import GlassCard from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const DashboardScreenEnhanced = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [healthConnected, setHealthConnected] = useState(false);
  const [healthDataRealtime, setHealthDataRealtime] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState(null);

  const connectHealthConnect = () => {
    Alert.alert(
      'Connect Health Connect',
      'Would you like to connect to Google Health Connect to sync your real health data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            // TODO: Implement Health Connect integration
            setHealthConnected(true);
            Alert.alert('Success', 'Health Connect will be integrated in the next update!');
          },
        },
      ]
    );
  };

  // Compute metrics from real health data when available. If unavailable, show zero/placeholder.
  const healthMetrics = [
    {
      icon: 'walk',
      label: 'Steps Today',
      value: healthDataRealtime?.steps ? String(healthDataRealtime.steps).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0',
      goal: '10,000',
      unit: 'steps',
      progress: healthDataRealtime?.steps ? Math.min(Math.round((healthDataRealtime.steps / 10000) * 100), 100) : 0,
      color: colors.accent,
      trend: null,
    },
    {
      icon: 'fire',
      label: 'Calories',
      value: healthDataRealtime?.calories_burned ? String(Math.round(healthDataRealtime.calories_burned)) : '0',
      goal: '2,200',
      unit: 'kcal',
      progress: healthDataRealtime?.calories_burned ? Math.min(Math.round((healthDataRealtime.calories_burned / 2200) * 100), 100) : 0,
      color: colors.warning,
      trend: null,
    },
    {
      icon: 'heart-pulse',
      label: 'Heart Rate',
      value: healthDataRealtime?.heart_rate ? String(Math.round(healthDataRealtime.heart_rate)) : '0',
      unit: 'bpm',
      progress: 0,
      color: colors.error,
      status: healthDataRealtime?.heart_rate ? 'Measured' : 'No data',
    },
    {
      icon: 'sleep',
      label: 'Sleep',
      value: healthDataRealtime?.sleep_hours ? String(healthDataRealtime.sleep_hours) : '0',
      goal: '8',
      unit: 'hours',
      progress: healthDataRealtime?.sleep_hours ? Math.min(Math.round((healthDataRealtime.sleep_hours / 8) * 100), 100) : 0,
      color: colors.purple,
      status: healthDataRealtime?.sleep_hours ? 'Good' : 'No data',
    },
  ];

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setDataLoaded(false);
      setDataError(null);
      const result = await getHealthData(1); // try to fetch last day
      // result may be an array of records, make a best-effort mapping
      if (result && Array.isArray(result) && result.length > 0) {
        const today = result[0];
        setHealthDataRealtime({
          steps: today.steps || 0,
          calories_burned: today.calories_burned || 0,
          distance: today.distance || 0,
          heart_rate: today.heart_rate || null,
          sleep_hours: today.sleep_hours || null,
        });
      } else if (result && typeof result === 'object') {
        // fallback if API returns object
        setHealthDataRealtime({
          steps: result.steps || 0,
          calories_burned: result.calories_burned || 0,
          distance: result.distance || 0,
          heart_rate: result.heart_rate || null,
          sleep_hours: result.sleep_hours || null,
        });
      } else {
        setHealthDataRealtime({ steps: 0, calories_burned: 0, distance: 0 });
      }
    } catch (error) {
      setDataError(error);
      setHealthDataRealtime({ steps: 0, calories_burned: 0, distance: 0 });
    } finally {
      setDataLoaded(true);
    }
  };

  const activityData = [
    { icon: 'run', label: 'Running', duration: '32 min', calories: 245, color: '#1A73E8' },
    { icon: 'bike', label: 'Cycling', duration: '45 min', calories: 320, color: '#10B981' },
    { icon: 'dumbbell', label: 'Strength', duration: '28 min', calories: 180, color: '#8B5CF6' },
    { icon: 'yoga', label: 'Yoga', duration: '20 min', calories: 95, color: '#F59E0B' },
  ];

  const healthStats = [
    { label: 'Weight', value: '75.2', unit: 'kg', change: '-0.5', icon: 'scale-bathroom', color: colors.success },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', icon: 'heart-pulse', color: colors.error },
    { label: 'Cholesterol', value: '180', unit: 'mg/dL', status: 'Good', icon: 'water', color: colors.purple },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Health Connect Banner */}
        {!healthConnected && (
          <TouchableOpacity
            style={[styles.healthConnectBanner, { backgroundColor: colors.card }]}
            onPress={connectHealthConnect}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isDark ? ['#2F80FF', '#3D8BFF'] : ['#1A73E8', '#4DA3FF']}
              style={styles.healthConnectGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.healthConnectContent}>
                <Icon name="google-fit" size={32} color="#fff" />
                <View style={styles.healthConnectText}>
                  <Text style={styles.healthConnectTitle}>Connect Health Data</Text>
                  <Text style={styles.healthConnectSubtitle}>
                    Sync with Google Health Connect for real-time data
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          {dataLoaded && dataError && (
            <View style={{ paddingHorizontal: 6, marginBottom: 12 }}>
              <Text style={{ color: colors.error, fontSize: 13 }}>* Real health data unavailable (Network Error). Showing zeros. Please ensure the app can reach the server or connect Health Connect.</Text>
            </View>
          )}
        )}

        {/* Main Health Metrics */}
        <View style={styles.metricsGrid}>
          {healthMetrics.map((metric, index) => (
            <GlassCard key={index} style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: `${metric.color}20` }]}>
                <Icon name={metric.icon} size={28} color={metric.color} />
              </View>
              
              <View style={styles.metricHeader}>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                  {metric.value}
                </Text>
                {metric.trend && (
                  <Text style={[styles.metricTrend, { color: colors.success }]}>
                    {metric.trend}
                  </Text>
                )}
              </View>
              
              <Text style={[styles.metricUnit, { color: colors.textTertiary }]}>
                {metric.unit}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {metric.label}
              </Text>
              
              {/* Progress Bar */}
              <View style={[styles.progressBar, { backgroundColor: `${metric.color}15` }]}>
                <LinearGradient
                  colors={[metric.color, `${metric.color}CC`]}
                  style={[styles.progressFill, { width: `${metric.progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              
              {metric.goal && (
                <Text style={[styles.metricGoal, { color: colors.textTertiary }]}>
                  Goal: {metric.goal} {metric.unit}
                </Text>
              )}
              {metric.status && (
                <Text style={[styles.metricStatus, { color: colors.success }]}>
                  {metric.status}
                </Text>
              )}
            </GlassCard>
          ))}
        </View>

        {/* Weight Tracking Card */}
        <GlassCard style={styles.weightCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="scale-bathroom" size={24} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Weight Tracking
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weightContent}>
            <View style={styles.weightMain}>
              <Text style={[styles.weightValue, { color: colors.textPrimary }]}>75.22</Text>
              <Text style={[styles.weightUnit, { color: colors.textSecondary }]}>kg</Text>
            </View>
            <View style={[styles.weightChange, { backgroundColor: `${colors.success}20` }]}>
              <Icon name="trending-down" size={16} color={colors.success} />
              <Text style={[styles.weightChangeText, { color: colors.success }]}>-0.5 kg</Text>
            </View>
          </View>
          
          {/* Simple Line Chart - only render when we have real history */}
          <View style={styles.chartPlaceholder}>
            {healthDataRealtime?.weight_history && healthDataRealtime.weight_history.length > 0 ? (
              <>
                <View style={[styles.chartLine, { backgroundColor: colors.border }]} />
                <LinearGradient
                  colors={[`${colors.accent}40`, `${colors.accent}00`]}
                  style={styles.chartGradient}
                />
              </>
            ) : (
              <Text style={{ color: colors.textTertiary }}>No weight history available to show a chart.</Text>
            )}
          </View>
        </GlassCard>

        {/* Activity Cards */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Today's Activities
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityGrid}>
          {activityData.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.activityCard, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Icon name={activity.icon} size={24} color={activity.color} />
              </View>
              <Text style={[styles.activityLabel, { color: colors.textPrimary }]}>
                {activity.label}
              </Text>
              <Text style={[styles.activityDuration, { color: colors.textSecondary }]}>
                {activity.duration}
              </Text>
              <Text style={[styles.activityCalories, { color: activity.color }]}>
                {activity.calories} kcal
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Stats */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Health Statistics
        </Text>
        
        {healthStats.map((stat, index) => (
          <GlassCard key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <Icon name={stat.icon} size={24} color={stat.color} />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statUnit, { color: colors.textTertiary }]}>
                  {stat.unit}
                </Text>
              </View>
            </View>
            {stat.change && (
              <View style={[styles.statChange, { backgroundColor: `${colors.success}20` }]}>
                <Text style={[styles.statChangeText, { color: colors.success }]}>
                  {stat.change} kg
                </Text>
              </View>
            )}
            {stat.status && (
              <View style={[styles.statStatus, { backgroundColor: `${colors.success}20` }]}>
                <Text style={[styles.statStatusText, { color: colors.success }]}>
                  {stat.status}
                </Text>
              </View>
            )}
          </GlassCard>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, isDark && styles.fabDark]}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={isDark ? ['#2F80FF', '#3D8BFF'] : ['#1A73E8', '#4DA3FF']}
          style={styles.fabGradient}
        >
          <Icon name="plus" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
    padding: 20,
  },
  healthConnectBanner: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  healthConnectGradient: {
    padding: 20,
  },
  healthConnectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  healthConnectText: {
    flex: 1,
  },
  healthConnectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  healthConnectSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 55) / 2,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  metricTrend: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricUnit: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricGoal: {
    fontSize: 11,
  },
  metricStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  weightCard: {
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  weightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weightMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  weightValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weightUnit: {
    fontSize: 20,
    fontWeight: '600',
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  weightChangeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chartPlaceholder: {
    height: 120,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  chartLine: {
    height: 2,
    width: '100%',
  },
  chartGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
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
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  activityCard: {
    width: (width - 55) / 2,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDuration: {
    fontSize: 13,
    marginBottom: 8,
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: '700',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 15,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
  },
  statChange: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statChangeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  fabDark: {
    shadowColor: '#2F80FF',
    shadowOpacity: 0.5,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreenEnhanced;
