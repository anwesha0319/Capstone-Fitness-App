import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle, getIconContainerStyle } from '../../utils/styleHelpers';

const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const healthMetrics = [
    {
      icon: 'walk',
      label: 'Steps Today',
      value: '7,842',
      unit: 'steps',
      progress: 78,
      color: colors.iconDumbbell,
    },
    {
      icon: 'fire',
      label: 'Calories',
      value: '420',
      unit: 'kcal',
      progress: 65,
      color: colors.iconFire,
    },
    {
      icon: 'heart-pulse',
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      progress: 85,
      color: colors.iconHeart,
    },
    {
      icon: 'sleep',
      label: 'Sleep',
      value: '7.2',
      unit: 'hours',
      progress: 90,
      color: colors.iconSleep,
    },
  ];

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Health Metrics Grid */}
        <View style={styles.metricsGrid}>
          {healthMetrics.map((metric, index) => (
            <GlassCard key={index} variant="primary" style={styles.metricCard}>
              <View style={getIconContainerStyle(colors, 'large', `${metric.color}30`)}>
                <Icon name={metric.icon} size={28} color={metric.color} />
              </View>
              <Text style={[getTypographyStyle(colors, 'h1'), styles.metricValue]}>
                {metric.value}
              </Text>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.metricUnit]}>
                {metric.unit}
              </Text>
              <Text style={[getTypographyStyle(colors, 'label'), styles.metricLabel]}>
                {metric.label}
              </Text>
              
              {/* Progress Bar */}
              <View style={[styles.progressBar, { backgroundColor: `${metric.color}20` }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${metric.progress}%`, backgroundColor: metric.color },
                  ]}
                />
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={[getTypographyStyle(colors, 'h2'), styles.sectionTitle]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <GlassCard variant="nested" style={styles.actionCardInner}>
              <Icon name="food-apple" size={32} color={colors.iconApple} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), styles.actionLabel]}>
                Diet Plan
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <GlassCard variant="nested" style={styles.actionCardInner}>
              <Icon name="dumbbell" size={32} color={colors.iconDumbbell} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), styles.actionLabel]}>
                Workout
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <GlassCard variant="nested" style={styles.actionCardInner}>
              <Icon name="run-fast" size={32} color={colors.accent} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), styles.actionLabel]}>
                Marathon
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <GlassCard variant="nested" style={styles.actionCardInner}>
              <Icon name="chart-line" size={32} color={colors.accent} />
              <Text style={[getTypographyStyle(colors, 'bodyMedium'), styles.actionLabel]}>
                Analytics
              </Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={[getTypographyStyle(colors, 'h2'), styles.sectionTitle]}>
          Recent Activity
        </Text>
        <GlassCard variant="primary" style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={getIconContainerStyle(colors, 'medium', `${colors.accent}20`)}>
              <Icon name="run" size={20} color={colors.accent} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                Morning Run
              </Text>
              <Text style={getTypographyStyle(colors, 'caption')}>
                Today, 6:30 AM • 3.2 km
              </Text>
            </View>
            <Text style={getTypographyStyle(colors, 'accent')}>
              245 kcal
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.activityItem}>
            <View style={getIconContainerStyle(colors, 'medium', `${colors.iconSleep}20`)}>
              <Icon name="sleep" size={20} color={colors.iconSleep} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                Sleep Tracking
              </Text>
              <Text style={getTypographyStyle(colors, 'caption')}>
                Last night • 7h 15m
              </Text>
            </View>
            <Text style={getTypographyStyle(colors, 'accent')}>
              Good
            </Text>
          </View>
        </GlassCard>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  metricCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  metricValue: {
    marginBottom: 2,
    marginTop: 12,
  },
  metricUnit: {
    marginBottom: 4,
  },
  metricLabel: {
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  actionCard: {
    width: '47%',
  },
  actionCardInner: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    textAlign: 'center',
  },
  activityCard: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  bottomSpace: {
    height: 40,
  },
});

export default DashboardScreen;
