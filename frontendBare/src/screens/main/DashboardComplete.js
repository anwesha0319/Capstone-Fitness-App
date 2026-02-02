import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const DashboardComplete = () => {
  const { colors, isDark } = useTheme();

  // Sample data - replace with real data from API
  const weeklySteps = [
    { day: 'Mon', steps: 4200, active: false },
    { day: 'Tue', steps: 6800, active: false },
    { day: 'Wed', steps: 8500, active: true }, // Today
    { day: 'Thu', steps: 0, active: false },
    { day: 'Fri', steps: 0, active: false },
    { day: 'Sat', steps: 0, active: false },
    { day: 'Sun', steps: 0, active: false },
  ];

  const maxSteps = Math.max(...weeklySteps.map(d => d.steps), 10000);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Steps Card - Weekly View */}
        <View style={[styles.largeCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="walk" size={24} color="#1A73E8" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Steps
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.accent }]}>This Week</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepsMainRow}>
            <View>
              <Text style={[styles.bigNumber, { color: colors.textPrimary }]}>8,500</Text>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Today</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
              <Icon name="trending-up" size={16} color="#10B981" />
              <Text style={[styles.badgeText, { color: '#10B981' }]}>+12%</Text>
            </View>
          </View>

          {/* Weekly Bar Chart */}
          <View style={styles.chartContainer}>
            {weeklySteps.map((item, index) => {
              const height = (item.steps / maxSteps) * 120;
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={item.active ? ['#1A73E8', '#4DA3FF'] : [colors.border, colors.border]}
                      style={[styles.bar, { height: height || 10 }]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, { color: colors.textTertiary }]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>6,500</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Avg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>10,000</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Goal</Text>
            </View>
          </View>
        </View>

        {/* Weight Tracking Card */}
        <View style={[styles.largeCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="scale-bathroom" size={24} color="#8B5CF6" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Weight Tracking
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weightRow}>
            <View>
              <View style={styles.weightMain}>
                <Text style={[styles.bigNumber, { color: colors.textPrimary }]}>75.22</Text>
                <Text style={[styles.unit, { color: colors.textSecondary }]}>kg</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
                <Icon name="trending-down" size={16} color="#10B981" />
                <Text style={[styles.badgeText, { color: '#10B981' }]}>-0.5 kg</Text>
              </View>
            </View>

            {/* Simple Line Chart Visualization */}
            <View style={styles.miniChart}>
              <View style={styles.chartLine}>
                {[40, 60, 45, 70, 55, 65, 50].map((height, i) => (
                  <View
                    key={i}
                    style={[
                      styles.chartDot,
                      {
                        bottom: height,
                        backgroundColor: i === 6 ? '#8B5CF6' : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Grid of Health Metrics */}
        <View style={styles.gridRow}>
          {/* Calories */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
              <Icon name="fire" size={24} color="#F59E0B" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>1,542</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Calories</Text>
            <View style={[styles.progressBar, { backgroundColor: '#F59E0B20' }]}>
              <LinearGradient
                colors={['#F59E0B', '#FBBF24']}
                style={[styles.progressFill, { width: '70%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={[styles.metricSubtext, { color: colors.textTertiary }]}>
              Target: 2,200
            </Text>
          </View>

          {/* Heart Rate */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#EF444420' }]}>
              <Icon name="heart-pulse" size={24} color="#EF4444" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>72</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Heart Rate</Text>
            {/* Mini heart rate wave */}
            <View style={styles.waveContainer}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.waveLine,
                    {
                      height: i % 2 === 0 ? 20 : 10,
                      backgroundColor: '#EF4444',
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.metricSubtext, { color: '#10B981' }]}>Normal</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          {/* Blood Pressure */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#3B82F620' }]}>
              <Icon name="water" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>121/80</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Blood Pressure</Text>
            {/* BP Bars */}
            <View style={styles.bpBars}>
              <View style={[styles.bpBar, { height: 30, backgroundColor: '#3B82F6' }]} />
              <View style={[styles.bpBar, { height: 20, backgroundColor: '#60A5FA' }]} />
            </View>
            <Text style={[styles.metricSubtext, { color: '#10B981' }]}>Good</Text>
          </View>

          {/* Stress Level */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
              <Icon name="brain" size={24} color="#F59E0B" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>42%</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Stress Level</Text>
            {/* Stress Gauge */}
            <View style={styles.gaugeContainer}>
              <View style={[styles.gaugeFill, { width: '42%', backgroundColor: '#10B981' }]} />
            </View>
            <Text style={[styles.metricSubtext, { color: '#10B981' }]}>Low</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          {/* Sleep */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#8B5CF620' }]}>
              <Icon name="sleep" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>7.2h</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Sleep</Text>
            {/* Sleep Wave */}
            <View style={styles.sleepWave}>
              {[15, 25, 20, 30, 18, 28, 22].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.sleepBar,
                    { height, backgroundColor: '#8B5CF6' },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.metricSubtext, { color: '#10B981' }]}>Good</Text>
          </View>

          {/* Cholesterol */}
          <View style={[styles.smallCard, { backgroundColor: colors.card, width: cardWidth }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
              <Icon name="test-tube" size={24} color="#10B981" />
            </View>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>180</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Cholesterol</Text>
            {/* Grid Heatmap */}
            <View style={styles.heatmapGrid}>
              {[1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1].map((active, i) => (
                <View
                  key={i}
                  style={[
                    styles.heatmapCell,
                    {
                      backgroundColor: active ? '#10B981' : colors.border,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.metricSubtext, { color: '#10B981' }]}>Normal</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recommendations
        </Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.actionGradient}
            >
              <Icon name="food-apple" size={32} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>
              Diet Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.actionGradient}
            >
              <Icon name="dumbbell" size={32} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>
              Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.actionGradient}
            >
              <Icon name="run-fast" size={32} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>
              Marathon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  largeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  stepsMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 52,
  },
  label: {
    fontSize: 14,
    marginTop: 4,
  },
  unit: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '70%',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  miniChart: {
    width: 120,
    height: 80,
    position: 'relative',
  },
  chartLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  metricSubtext: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 30,
    marginTop: 8,
  },
  waveLine: {
    width: 4,
    borderRadius: 2,
  },
  bpBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 40,
    marginTop: 8,
  },
  bpBar: {
    flex: 1,
    borderRadius: 4,
  },
  gaugeContainer: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  sleepWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 30,
    marginTop: 8,
  },
  sleepBar: {
    flex: 1,
    borderRadius: 2,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  heatmapCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 60) / 3,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});

export default DashboardComplete;
