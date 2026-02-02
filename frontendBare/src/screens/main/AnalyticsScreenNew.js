import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { saveHealthData, getHealthData, saveGoals, getGoals } from '../../utils/storage';

const { width } = Dimensions.get('window');

const AnalyticsScreenNew = () => {
  const { colors, isDark } = useTheme();
  const [stressLevel, setStressLevel] = useState(42);
  const [isEditing, setIsEditing] = useState(false);

  // User input states
  const [diet, setDiet] = useState('Vegetarian');
  const [smokingStatus, setSmokingStatus] = useState('Non-smoker');
  const [alcoholConsumption, setAlcoholConsumption] = useState('Occasional');
  const [pulse, setPulse] = useState('72');
  const [temperature, setTemperature] = useState('98.6');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('75');
  const [calories, setCalories] = useState('2200');
  const [hydration, setHydration] = useState('3.0');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const healthData = await getHealthData();
    const goals = await getGoals();
    
    setHeight(healthData.height);
    setWeight(healthData.weight);
    setPulse(healthData.pulse);
    setTemperature(healthData.temperature);
    setCalories(healthData.calories || goals.caloriesGoal);
    setHydration(healthData.hydration || goals.waterGoal);
    setDiet(healthData.diet);
    setSmokingStatus(healthData.smokingStatus);
    setAlcoholConsumption(healthData.alcoholConsumption);
    setStressLevel(healthData.stressLevel);
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h && w) {
      return (w / (h * h)).toFixed(1);
    }
    return '0';
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: colors.warning };
    if (bmi < 25) return { text: 'Normal', color: colors.success };
    if (bmi < 30) return { text: 'Overweight', color: colors.warning };
    return { text: 'Obese', color: colors.error };
  };

  const bmi = calculateBMI();
  const bmiStatus = getBMIStatus(parseFloat(bmi));

  const handleSave = async () => {
    const healthData = {
      height,
      weight,
      pulse,
      temperature,
      calories,
      hydration,
      diet,
      smokingStatus,
      alcoholConsumption,
      stressLevel,
    };
    
    const goals = {
      caloriesGoal: calories,
      waterGoal: hydration,
    };
    
    await saveHealthData(healthData);
    await saveGoals(goals);
    
    setIsEditing(false);
    Alert.alert('Success', 'Your health data has been saved!');
  };

  return (
    <LinearGradient
      colors={isDark ? ['#182E3D', '#091215'] : ['#A3B8C8', '#758A9A']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Analytics</Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: isEditing ? colors.success : colors.accent }]}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Icon name={isEditing ? 'content-save' : 'pencil'} size={20} color="#fff" />
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Goals */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Daily Goals</Text>
        <View style={styles.grid}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="walk" size={28} color={colors.accent} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>10,000</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Steps Goal</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="fire" size={28} color={colors.orange} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>2,200</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Calories Goal</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="water" size={28} color={colors.accent} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>3.0L</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Water Goal</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="sleep" size={28} color={colors.purple} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>8h</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Sleep Goal</Text>
          </View>
        </View>

        {/* Body Measurements */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Body Measurements</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Height (cm)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Weight (kg)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.bmiRow}>
            <View>
              <Text style={[styles.bmiLabel, { color: colors.textSecondary }]}>BMI</Text>
              <Text style={[styles.bmiValue, { color: colors.textPrimary }]}>{bmi}</Text>
            </View>
            <View style={[styles.bmiStatus, { backgroundColor: bmiStatus.color + '30' }]}>
              <Text style={[styles.bmiStatusText, { color: bmiStatus.color }]}>{bmiStatus.text}</Text>
            </View>
          </View>
        </View>

        {/* Vitals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Vitals</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Pulse (BPM)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={pulse}
              onChangeText={setPulse}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Temperature (°F)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={temperature}
              onChangeText={setTemperature}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Stress Level with Speedometer */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Stress Level</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <View style={[styles.stressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.stressHeader}>
            <Text style={[styles.stressValue, { color: colors.textPrimary }]}>{stressLevel}%</Text>
            <Text style={[styles.stressLabel, { color: colors.textSecondary }]}>
              {stressLevel < 30 ? 'Low' : stressLevel < 60 ? 'Moderate' : 'High'}
            </Text>
          </View>

          {/* Speedometer Gauge */}
          <View style={styles.gaugeContainer}>
            <View style={[styles.gaugeBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.gaugeFill,
                  {
                    width: `${stressLevel}%`,
                    backgroundColor:
                      stressLevel < 30
                        ? colors.success
                        : stressLevel < 60
                        ? colors.warning
                        : colors.error,
                  },
                ]}
              />
            </View>
            <View style={styles.gaugeLabels}>
              <Text style={[styles.gaugeLabel, { color: colors.textTertiary }]}>Low</Text>
              <Text style={[styles.gaugeLabel, { color: colors.textTertiary }]}>Moderate</Text>
              <Text style={[styles.gaugeLabel, { color: colors.textTertiary }]}>High</Text>
            </View>
          </View>

          <View style={styles.stressButtons}>
            <TouchableOpacity
              style={[styles.stressButton, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
              onPress={() => setStressLevel(Math.max(0, stressLevel - 10))}
            >
              <Icon name="minus" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stressButton, { backgroundColor: colors.cardGlass, borderColor: colors.border }]}
              onPress={() => setStressLevel(Math.min(100, stressLevel + 10))}
            >
              <Icon name="plus" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nutrition */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Nutrition</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Daily Calories Target</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hydration Goal (Liters)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              value={hydration}
              onChangeText={setHydration}
              keyboardType="numeric"
              editable={isEditing}
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Lifestyle</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Diet Type</Text>
            {isEditing ? (
              <View style={styles.dropdownButtons}>
                {['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Paleo'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      {
                        backgroundColor: diet === option ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setDiet(option)}
                  >
                    <Text style={[styles.dropdownText, { color: diet === option ? '#fff' : colors.textPrimary }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.displayValue, { color: colors.textPrimary }]}>{diet}</Text>
            )}
          </View>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Smoking Status</Text>
            {isEditing ? (
              <View style={styles.dropdownButtons}>
                {['Non-smoker', 'Occasional', 'Regular', 'Heavy'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      {
                        backgroundColor: smokingStatus === option ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setSmokingStatus(option)}
                  >
                    <Text style={[styles.dropdownText, { color: smokingStatus === option ? '#fff' : colors.textPrimary }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.displayValue, { color: colors.textPrimary }]}>{smokingStatus}</Text>
            )}
          </View>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Alcohol Consumption</Text>
            {isEditing ? (
              <View style={styles.dropdownButtons}>
                {['None', 'Occasional', 'Moderate', 'Regular'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      {
                        backgroundColor: alcoholConsumption === option ? colors.accent : colors.cardGlass,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setAlcoholConsumption(option)}
                  >
                    <Text style={[styles.dropdownText, { color: alcoholConsumption === option ? '#fff' : colors.textPrimary }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.displayValue, { color: colors.textPrimary }]}>{alcoholConsumption}</Text>
            )}
          </View>
        </View>

        {/* Sleep Analysis */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sleep Analysis</Text>
        <View style={styles.grid}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="sleep" size={28} color={colors.purple} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>7.2h</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Avg Sleep</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="sleep-off" size={28} color={colors.warning} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>85%</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Sleep Quality</Text>
          </View>
        </View>

        {/* Cycling/Activity */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Activity Tracking</Text>
        <View style={styles.grid}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="bike" size={28} color={colors.accent} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>12.5</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>KM Cycled</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="run" size={28} color={colors.orange} />
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>5.2</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>KM Running</Text>
          </View>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  inputCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  bmiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  bmiLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  bmiStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bmiStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stressCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  stressHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stressValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stressLabel: {
    fontSize: 16,
  },
  gaugeContainer: {
    marginBottom: 20,
  },
  gaugeBg: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 10,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gaugeLabel: {
    fontSize: 12,
  },
  stressButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  stressButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  bottomSpace: {
    height: 20,
  },
  dropdownButtons: {
    gap: 8,
    marginTop: 8,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
  },
  displayValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AnalyticsScreenNew;
