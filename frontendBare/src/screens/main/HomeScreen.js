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
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { healthAPI } from '../../api/endpoints';
import HealthDataSync from '../../components/HealthDataSync';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(null);

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

  const handleSyncComplete = async () => {
    // Reload data after successful sync
    await loadData();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your fitness data...</Text>
      </View>
    );
  }

  const chartData = {
    labels: analytics?.daily_data?.slice(-7).map(d => 
      new Date(d.date).toLocaleDateString('en', { weekday: 'short' })
    ) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: analytics?.daily_data?.slice(-7).map(d => d.steps) || [0, 0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
      }>
      
      {/* Header */}
      <LinearGradient
        colors={['#1a1a1a', '#000']}
        style={styles.header}>
        <Text style={styles.greeting}>Good {getTimeOfDay()}! 💪</Text>
        <Text style={styles.subtitle}>Let's crush your fitness goals today</Text>
        
        {/* Health Connect Sync Component */}
        <HealthDataSync onSyncComplete={handleSyncComplete} />
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="walk"
          title="Steps"
          value={formatNumber(analytics?.total_steps || 0)}
          subtitle={`Avg: ${formatNumber(Math.round(analytics?.avg_steps || 0))}`}
          color="#FF6B6B"
        />
        <StatCard
          icon="fire"
          title="Calories"
          value={formatNumber(Math.round(analytics?.total_calories || 0))}
          subtitle={`Avg: ${formatNumber(Math.round(analytics?.avg_calories || 0))}`}
          color="#FFA500"
        />
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="map-marker-distance"
          title="Distance"
          value={`${(analytics?.total_distance || 0).toFixed(1)} km`}
          subtitle="Last 7 days"
          color="#4CAF50"
        />
        <StatCard
          icon="dumbbell"
          title="Workouts"
          value={analytics?.workout_count || 0}
          subtitle="Sessions"
          color="#2196F3"
        />
      </View>

      {/* Steps Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Steps</Text>
        {chartData.datasets[0].data.some(val => val > 0) ? (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1a1a1a',
              backgroundGradientFrom: '#1a1a1a',
              backgroundGradientTo: '#1a1a1a',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4CAF50',
              },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="chart-line" size={48} color="#666" />
            <Text style={styles.noDataText}>No data available yet</Text>
            <Text style={styles.noDataSubtext}>Sync your health data to see insights</Text>
          </View>
        )}
      </View>

      {/* Additional Stats */}
      {analytics?.avg_heart_rate > 0 && (
        <View style={styles.additionalStats}>
          <View style={styles.statRow}>
            <Icon name="heart-pulse" size={24} color="#FF6B6B" />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Avg Heart Rate</Text>
              <Text style={styles.statValue}>{Math.round(analytics.avg_heart_rate)} BPM</Text>
            </View>
          </View>
        </View>
      )}

      {analytics?.avg_sleep_hours > 0 && (
        <View style={styles.additionalStats}>
          <View style={styles.statRow}>
            <Icon name="sleep" size={24} color="#9C27B0" />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Avg Sleep</Text>
              <Text style={styles.statValue}>{analytics.avg_sleep_hours.toFixed(1)} hours</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Icon name={icon} size={28} color={color} />
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    color: '#666',
    fontSize: 14,
  },
  additionalStats: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  bottomPadding: {
    height: 30,
  },
});

export default HomeScreen;