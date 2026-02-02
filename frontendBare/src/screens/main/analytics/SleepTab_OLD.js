import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../../context/ThemeContext';
import { saveHealthData, getHealthData, saveGoals, getGoals } from '../../../utils/storage';

const { width } = Dimensions.get('window');

const SleepTab = () => {
  const { colors, isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [sleepGoal, setSleepGoal] = useState('8');
  const [bedtime, setBedtime] = useState('22:00');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const goals = await getGoals();
    setSleepGoal(goals.sleepGoal || '8');
    setBedtime(goals.bedtime || '22:00');
  };

  const handleSave = async () => {
    await saveGoals({ sleepGoal, bedtime });
    setIsEditing(false);
  };

  const sleepData = [
    { day: 'Mon', hours: 7.2, quality: 85 },
    { day: 'Tue', hours: 6.8, quality: 78 },
    { day: 'Wed', hours: 8.1, quality: 92 },
    { day: 'Thu', hours: 7.5, quality: 88 },
    { day: 'Fri', hours: 6.5, quality: 72 },
    { day: 'Sat', hours: 8.5, quality: 95 },
    { day: 'Sun', hours: 7.8, quality: 90 }
  ];

  const avgSleep = (sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length).toFixed(1);
  const avgQuality = Math.round(sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length);

  const sleepStages = [
    { stage: 'Deep', hours: 2.1, color: '#5A9FBF', icon: 'sleep' },
    { stage: 'Light', hours: 3.8, color: '#8FA9B8', icon: 'weather-night' },
    { stage: 'REM', hours: 1.5, color: '#AB47BC', icon: 'eye' },
    { stage: 'Awake', hours: 0.4, color: '#FFA726', icon: 'eye-outline' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sleep</Text>
        <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))} style={[styles.editBtn, { backgroundColor: isEditing ? colors.success : colors.accent }]}>
          <Icon name={isEditing ? 'content-save' : 'pencil'} size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="sleep" size={32} color={colors.accent} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{avgSleep}h</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg Sleep</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="star" size={32} color={colors.warning} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{avgQuality}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Sleep Quality</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Icon name="target" size={32} color={colors.success} />
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{sleepGoal}h</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Goal</Text>
        </View>
      </View>

      {/* Sleep Duration Chart */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sleep Duration (Last 7 Days)</Text>
        <BarChart
          data={{
            labels: sleepData.map(d => d.day),
            datasets: [{ data: sleepData.map(d => d.hours) }]
          }}
          width={width - 80}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 1,
            color: (opacity = 1) => isDark ? `rgba(90, 159, 191, ${opacity})` : `rgba(90, 122, 143, ${opacity})`,
            labelColor: (opacity = 1) => isDark ? `rgba(232, 241, 245, ${opacity})` : `rgba(26, 37, 48, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.7
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
        <View style={[styles.goalLine, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
          <Icon name="flag" size={16} color={colors.success} />
          <Text style={[styles.goalText, { color: colors.textPrimary }]}>Goal: {sleepGoal} hours</Text>
        </View>
      </View>

      {/* Sleep Quality Trend */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sleep Quality Trend</Text>
        <LineChart
          data={{
            labels: sleepData.map(d => d.day),
            datasets: [{ data: sleepData.map(d => d.quality) }]
          }}
          width={width - 80}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(171, 71, 188, ${opacity})`,
            labelColor: (opacity = 1) => isDark ? `rgba(232, 241, 245, ${opacity})` : `rgba(26, 37, 48, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '5', strokeWidth: '2', stroke: colors.purple }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* Sleep Stages */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sleep Stages (Last Night)</Text>
        <View style={styles.stagesContainer}>
          {sleepStages.map((stage, index) => (
            <View key={index} style={styles.stageRow}>
              <View style={[styles.stageIcon, { backgroundColor: stage.color + '20' }]}>
                <Icon name={stage.icon} size={24} color={stage.color} />
              </View>
              <View style={styles.stageInfo}>
                <Text style={[styles.stageName, { color: colors.textPrimary }]}>{stage.stage}</Text>
                <View style={styles.stageBar}>
                  <View style={[styles.stageFill, { width: `${(stage.hours / 8) * 100}%`, backgroundColor: stage.color }]} />
                </View>
              </View>
              <Text style={[styles.stageHours, { color: colors.textPrimary }]}>{stage.hours}h</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Sleep Time</Text>
          <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
            {sleepStages.reduce((sum, s) => sum + s.hours, 0).toFixed(1)}h
          </Text>
        </View>
      </View>

      {/* Sleep Schedule */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sleep Schedule</Text>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Icon name="weather-night" size={32} color={colors.accent} />
            <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>Bedtime</Text>
            <Text style={[styles.scheduleValue, { color: colors.textPrimary }]}>{bedtime}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Icon name="weather-sunny" size={32} color={colors.warning} />
            <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>Wake Up</Text>
            <Text style={[styles.scheduleValue, { color: colors.textPrimary }]}>06:00</Text>
          </View>
        </View>
        <View style={[styles.insightBox, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
          <Icon name="lightbulb-on" size={20} color={colors.accent} />
          <Text style={[styles.insightText, { color: colors.textPrimary }]}>
            Maintain consistent sleep schedule for better quality rest
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  editBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  card: { padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  goalLine: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 8, marginTop: 8 },
  goalText: { fontSize: 14, fontWeight: '600' },
  stagesContainer: { gap: 16 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  stageInfo: { flex: 1 },
  stageName: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  stageBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  stageFill: { height: '100%', borderRadius: 4 },
  stageHours: { fontSize: 14, fontWeight: 'bold', width: 50, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  totalLabel: { fontSize: 14, fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  scheduleRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  scheduleItem: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16 },
  scheduleLabel: { fontSize: 12, marginTop: 8 },
  scheduleValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  insightBox: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, gap: 12, alignItems: 'center' },
  insightText: { flex: 1, fontSize: 14 },
});

export default SleepTab;
