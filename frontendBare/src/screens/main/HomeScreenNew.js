import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { healthAPI } from '../../api/endpoints';
import HealthDataSync from '../../components/HealthDataSync';

const screenWidth = Dimensions.get('window').width;

const HomeScreenNew = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [hydration, setHydration] = useState(65);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await healthAPI.getAnalytics(7);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      Alert.alert('Error', 'Failed to load fitness data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF88" />
        <Text style={styles.loadingText}>Loading your vitality...</Text>
      </View>
    );
  }

  const totalCalories = analytics?.total_calories || 0;
  const avgSteps = analytics?.avg_steps || 0;
  const totalSteps = analytics?.total_steps || 0;

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#0f1428']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF88" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Daily Vitality</Text>
          <Text style={styles.date}>Today's Overview</Text>
        </View>

        {/* Health Sync */}
        <View style={styles.syncContainer}>
          <HealthDataSync onSyncComplete={loadData} />
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Steps Card - Large */}
          <GlassCard style={[styles.bentoItem, styles.largeCard]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Icon name="walk" size={32} color="#00FF88" />
                <Text style={styles.cardTitle}>Steps</Text>
              </View>
              <Text style={styles.largeValue}>{Math.round(totalSteps).toLocaleString()}</Text>
              <Text style={styles.cardSubtitle}>Avg: {Math.round(avgSteps).toLocaleString()}</Text>
            </View>
          </GlassCard>

          {/* Calories Card */}
          <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
            <View style={styles.cardContent}>
              <Icon name="fire" size={28} color="#FF6B35" />
              <Text style={styles.cardTitle}>Calories</Text>
              <Text style={styles.mediumValue}>{Math.round(totalCalories)}</Text>
              <Text style={styles.cardSubtitle}>kcal</Text>
            </View>
          </GlassCard>

          {/* Hydration Card */}
          <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
            <View style={styles.cardContent}>
              <View style={styles.hydrationContainer}>
                <View style={styles.waterBottle}>
                  <View style={[styles.waterFill, { height: `${hydration}%` }]} />
                </View>
              </View>
              <Text style={styles.hydrationPercent}>{hydration}%</Text>
              <Text style={styles.cardSubtitle}>Hydrated</Text>
            </View>
          </GlassCard>

          {/* Workouts Card */}
          <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
            <View style={styles.cardContent}>
              <Icon name="dumbbell" size={28} color="#00D9FF" />
              <Text style={styles.cardTitle}>Workouts</Text>
              <Text style={styles.mediumValue}>{analytics?.workout_count || 0}</Text>
              <Text style={styles.cardSubtitle}>Sessions</Text>
            </View>
          </GlassCard>

          {/* Distance Card */}
          <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
            <View style={styles.cardContent}>
              <Icon name="map-marker-distance" size={28} color="#FFD700" />
              <Text style={styles.cardTitle}>Distance</Text>
              <Text style={styles.mediumValue}>{(analytics?.total_distance || 0).toFixed(1)}</Text>
              <Text style={styles.cardSubtitle}>km</Text>
            </View>
          </GlassCard>

          {/* Heart Rate Card */}
          {analytics?.avg_heart_rate > 0 && (
            <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
              <View style={styles.cardContent}>
                <Icon name="heart-pulse" size={28} color="#FF1744" />
                <Text style={styles.cardTitle}>Heart Rate</Text>
                <Text style={styles.mediumValue}>{Math.round(analytics.avg_heart_rate)}</Text>
                <Text style={styles.cardSubtitle}>bpm</Text>
              </View>
            </GlassCard>
          )}

          {/* Sleep Card */}
          {analytics?.avg_sleep_hours > 0 && (
            <GlassCard style={[styles.bentoItem, styles.mediumCard]}>
              <View style={styles.cardContent}>
                <Icon name="sleep" size={28} color="#9C27B0" />
                <Text style={styles.cardTitle}>Sleep</Text>
                <Text style={styles.mediumValue}>{analytics.avg_sleep_hours.toFixed(1)}</Text>
                <Text style={styles.cardSubtitle}>hours</Text>
              </View>
            </GlassCard>
          )}
        </View>

        {/* Nutrition Breakdown */}
        <GlassCard style={styles.nutritionCard}>
          <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
          <View style={styles.macrosContainer}>
            <MacroItem label="Protein" value="150g" color="#00FF88" />
            <MacroItem label="Carbs" value="200g" color="#00D9FF" />
            <MacroItem label="Fats" value="65g" color="#FFD700" />
          </View>
        </GlassCard>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const GlassCard = ({ children, style }) => (
  <View style={[styles.glassCard, style]}>
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.glassGradient}
    >
      {children}
    </LinearGradient>
  </View>
);

const MacroItem = ({ label, value, color }) => (
  <View style={styles.macroItem}>
    <View style={[styles.macroDot, { backgroundColor: color }]} />
    <View style={styles.macroInfo}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
  loadingText: {
    color: '#00FF88',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  syncContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bentoGrid: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  bentoItem: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  largeCard: {
    minHeight: 180,
  },
  mediumCard: {
    minHeight: 140,
  },
  glassCard: {
    backgroundColor: 'rgba(20, 30, 60, 0.4)',
    backdropFilter: 'blur(20px)',
  },
  glassGradient: {
    flex: 1,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '600',
  },
  largeValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  mediumValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  hydrationContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  waterBottle: {
    width: 40,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00D9FF',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
  },
  waterFill: {
    width: '100%',
    backgroundColor: '#00D9FF',
    borderRadius: 6,
  },
  hydrationPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00D9FF',
  },
  nutritionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    minHeight: 160,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  macrosContainer: {
    gap: 12,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  macroDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  macroInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreenNew;
