import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../../context/ThemeContext';

const { width } = Dimensions.get('window');

const ActivityTab = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [timeFilter, setTimeFilter] = useState('7D');

  const weeklyActivity = [
    { day: 'Mon', steps: 8500, calories: 420, distance: 6.2, minutes: 52 },
    { day: 'Tue', steps: 6200, calories: 310, distance: 4.5, minutes: 38 },
    { day: 'Wed', steps: 10200, calories: 510, distance: 7.4, minutes: 68 },
    { day: 'Thu', steps: 7800, calories: 390, distance: 5.7, minutes: 48 },
    { day: 'Fri', steps: 5400, calories: 270, distance: 3.9, minutes: 35 },
    { day: 'Sat', steps: 12500, calories: 625, distance: 9.1, minutes: 82 },
    { day: 'Sun', steps: 9300, calories: 465, distance: 6.8, minutes: 60 }
  ];

  const activities = [
    { name: 'Running', duration: 45, calories: 450, icon: 'run', color: '#EF5350', time: '07:00' },
    { name: 'Cycling', duration: 60, calories: 380, icon: 'bike', color: '#FFA726', time: '17:30' },
    { name: 'Yoga', duration: 30, calories: 120, icon: 'yoga', color: '#66BB6A', time: '19:00' },
    { name: 'Walking', duration: 40, calories: 180, icon: 'walk', color: '#5A9FBF', time: '20:30' }
  ];

  const avgSteps = Math.round(weeklyActivity.reduce((sum, d) => sum + d.steps, 0) / weeklyActivity.length);
  const avgCalories = Math.round(weeklyActivity.reduce((sum, d) => sum + d.calories, 0) / weeklyActivity.length);
  const totalDistance = weeklyActivity.reduce((sum, d) => sum + d.distance, 0).toFixed(1);
  const totalMinutes = weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);

  const achievements = [
    { title: '10K Steps', description: 'Reached 10,000 steps', icon: 'trophy', color: '#FFD700', achieved: true },
    { title: 'Week Warrior', description: '7 days active streak', icon: 'fire', color: '#EF5350', achieved: true },
    { title: 'Distance King', description: 'Walked 50km this week', icon: 'map-marker-distance', color: '#66BB6A', achieved: true },
    { title: 'Early Bird', description: 'Morning workout 5 days', icon: 'weather-sunset-up', color: '#FFA726', achieved: false }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Activity</Text>

      {/* Weekly Summary */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="shoe-print" size={28} color={colors.accent} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{avgSteps}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg Steps</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="fire" size={28} color={colors.error} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{avgCalories}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg Calories</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="map-marker-distance" size={28} color={colors.success} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{totalDistance}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Km</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="clock-outline" size={28} color={colors.warning} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{totalMinutes}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Mins</Text>
        </View>
      </View>

      {/* Steps Chart */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Daily Steps</Text>
          <View style={styles.filterRow}>
            {['7D', '30D', '90D'].map(f => (
              <TouchableOpacity key={f} onPress={() => setTimeFilter(f)} style={[styles.filterBtn, { backgroundColor: timeFilter === f ? colors.accent : colors.cardGlass }]}>
                <Text style={[styles.filterText, { color: timeFilter === f ? '#FFF' : colors.textSecondary }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <BarChart
          data={{
            labels: weeklyActivity.map(d => d.day),
            datasets: [{ data: weeklyActivity.map(d => d.steps) }]
          }}
          width={width - 80}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => isDark ? `rgba(90, 159, 191, ${opacity})` : `rgba(90, 122, 143, ${opacity})`,
            labelColor: (opacity = 1) => isDark ? `rgba(232, 241, 245, ${opacity})` : `rgba(26, 37, 48, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.7
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* Calories Burned */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Calories Burned</Text>
        <LineChart
          data={{
            labels: weeklyActivity.map(d => d.day),
            datasets: [{ data: weeklyActivity.map(d => d.calories) }]
          }}
          width={width - 80}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(239, 83, 80, ${opacity})`,
            labelColor: (opacity = 1) => isDark ? `rgba(232, 241, 245, ${opacity})` : `rgba(26, 37, 48, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '5', strokeWidth: '2', stroke: colors.error }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* Today's Activities */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Today's Activities</Text>
        {activities.map((activity, index) => (
          <View key={index} style={[styles.activityRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <Icon name={activity.icon} size={28} color={activity.color} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityName, { color: colors.textPrimary }]}>{activity.name}</Text>
              <View style={styles.activityDetails}>
                <View style={styles.detailItem}>
                  <Icon name="clock-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{activity.duration} min</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="fire" size={14} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{activity.calories} cal</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="clock-time-four" size={14} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{activity.time}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Activity Time</Text>
          <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
            {activities.reduce((sum, a) => sum + a.duration, 0)} minutes
          </Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.achievementHeader}>
          <Icon name="trophy" size={24} color={colors.warning} />
          <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 0 }]}>Achievements</Text>
        </View>
        <View style={styles.achievementGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementCard, { backgroundColor: achievement.achieved ? achievement.color + '15' : colors.cardGlass, borderColor: achievement.achieved ? achievement.color : colors.border, opacity: achievement.achieved ? 1 : 0.5 }]}>
              <Icon name={achievement.icon} size={32} color={achievement.achieved ? achievement.color : colors.textTertiary} />
              <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>{achievement.title}</Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>{achievement.description}</Text>
              {achievement.achieved && (
                <View style={styles.achievedBadge}>
                  <Icon name="check" size={12} color="#FFF" />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Activity Insights */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.insightHeader}>
          <Icon name="lightbulb-on" size={24} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 0 }]}>Activity Insights</Text>
        </View>
        <View style={styles.insightsList}>
          <View style={[styles.insightBox, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
            <Icon name="trending-up" size={20} color={colors.success} />
            <Text style={[styles.insightText, { color: colors.textPrimary }]}>
              Your activity increased by 15% this week compared to last week
            </Text>
          </View>
          <View style={[styles.insightBox, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
            <Icon name="information" size={20} color={colors.accent} />
            <Text style={[styles.insightText, { color: colors.textPrimary }]}>
              Most active day: Saturday with 12,500 steps
            </Text>
          </View>
          <View style={[styles.insightBox, { backgroundColor: colors.warning + '10', borderColor: colors.warning }]}>
            <Icon name="target" size={20} color={colors.warning} />
            <Text style={[styles.insightText, { color: colors.textPrimary }]}>
              You're 2,300 steps away from your weekly goal
            </Text>
          </View>
        </View>
      </View>

      {/* AI Training Plans */}
      {navigation && (
        <View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 16 }]}>AI Training Plans</Text>
          
          <TouchableOpacity
            style={[styles.aiPlanButton, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}
            onPress={() => navigation.navigate('WorkoutPlan')}
          >
            <Icon name="dumbbell" size={28} color={colors.accent} />
            <View style={styles.aiPlanContent}>
              <Text style={[styles.aiPlanTitle, { color: colors.textPrimary }]}>Get Workout Plan</Text>
              <Text style={[styles.aiPlanSubtitle, { color: colors.textSecondary }]}>Personalized exercise routine</Text>
            </View>
            <Icon name="arrow-right" size={24} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aiPlanButton, { backgroundColor: colors.purple + '20', borderColor: colors.purple }]}
            onPress={() => navigation.navigate('MarathonPlan')}
          >
            <Icon name="run-fast" size={28} color={colors.purple} />
            <View style={styles.aiPlanContent}>
              <Text style={[styles.aiPlanTitle, { color: colors.textPrimary }]}>Get Marathon Plan</Text>
              <Text style={[styles.aiPlanSubtitle, { color: colors.textSecondary }]}>Race preparation training</Text>
            </View>
            <Icon name="arrow-right" size={24} color={colors.purple} />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  summaryCard: { width: (width - 56) / 2, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  card: { padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  filterText: { fontSize: 12, fontWeight: '600' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  activityIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  activityDetails: { flexDirection: 'row', gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  totalLabel: { fontSize: 14, fontWeight: '600' },
  totalValue: { fontSize: 16, fontWeight: 'bold' },
  achievementHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achievementCard: { width: (width - 76) / 2, padding: 16, borderRadius: 16, borderWidth: 2, alignItems: 'center', position: 'relative' },
  achievementTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  achievementDesc: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  achievedBadge: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#66BB6A', justifyContent: 'center', alignItems: 'center' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  insightsList: { gap: 12 },
  insightBox: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, gap: 12, alignItems: 'center' },
  insightText: { flex: 1, fontSize: 13, lineHeight: 18 },
  aiPlanButton: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 2, gap: 16, marginBottom: 16 },
  aiPlanContent: { flex: 1 },
  aiPlanTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  aiPlanSubtitle: { fontSize: 14 },
});

export default ActivityTab;
