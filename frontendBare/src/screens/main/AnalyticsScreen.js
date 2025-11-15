import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { healthAPI } from '../../api/endpoints';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await healthAPI.getAnalytics(period);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const dailyData = analytics?.daily_data || [];
  const stepsData = dailyData.slice(-7);

  const barChartData = {
    labels: stepsData.map(d => new Date(d.date).toLocaleDateString('en', { day: 'numeric' })),
    datasets: [{
      data: stepsData.length > 0 ? stepsData.map(d => d.calories_burned || 1) : [1, 1, 1, 1, 1, 1, 1],
    }],
  };

  const workoutDistribution = [
    { name: 'Cardio', count: 5, color: '#FF6B6B', legendFontColor: '#fff' },
    { name: 'Strength', count: 3, color: '#4CAF50', legendFontColor: '#fff' },
    { name: 'Flexibility', count: 2, color: '#2196F3', legendFontColor: '#fff' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodSelector}>
          {[7, 30, 90].map(days => (
            <TouchableOpacity
              key={days}
              style={[styles.periodButton, period === days && styles.periodButtonActive]}
              onPress={() => setPeriod(days)}>
              <Text style={[styles.periodText, period === days && styles.periodTextActive]}>
                {days}D
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <SummaryCard
          icon="trending-up"
          title="Progress"
          value="+12%"
          subtitle="vs last period"
          color="#4CAF50"
        />
        <SummaryCard
          icon="target"
          title="Goal Rate"
          value="85%"
          subtitle="on track"
          color="#2196F3"
        />
      </View>

      {/* Calories Burned Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Calories Burned</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#1a1a1a',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
          fromZero
        />
      </View>

      {/* Workout Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Distribution</Text>
        <PieChart
          data={workoutDistribution}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <InsightCard
          icon="lightbulb"
          text="You're most active on weekdays. Try maintaining consistency on weekends too!"
          color="#FFA500"
        />
        <InsightCard
          icon="water"
          text="Your average sleep is 6.5 hours. Aim for 7-8 hours for better recovery."
          color="#2196F3"
        />
        <InsightCard
          icon="fire"
          text="Great job! You've burned 15% more calories this week."
          color="#4CAF50"
        />
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const SummaryCard = ({ icon, title, value, subtitle, color }) => (
  <View style={styles.summaryCard}>
    <Icon name={icon} size={32} color={color} />
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    <Text style={styles.summarySubtitle}>{subtitle}</Text>
  </View>
);

const InsightCard = ({ icon, text, color }) => (
  <View style={styles.insightCard}>
    <View style={[styles.insightIcon, { backgroundColor: color + '20' }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={styles.insightText}>{text}</Text>
  </View>
);

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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  periodText: {
    color: '#888',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
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
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 30,
  },
});

export default AnalyticsScreen;