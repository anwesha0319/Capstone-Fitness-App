import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import GlassInput from '../../components/GlassInput';
import AppLogo from '../../components/AppLogo';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle, getIconContainerStyle } from '../../utils/styleHelpers';
import { authAPI } from '../../api/endpoints';

const SignupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  // Step 1: Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Step 2: Physical Profile
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  
  // Step 3: Fitness Goal
  const [fitnessGoal, setFitnessGoal] = useState('');
  
  // Step 4: Password
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = async () => {
    if (step === 1) {
      if (!firstName || !lastName || !email || !dateOfBirth) {
        Alert.alert('Error', 'Please fill in all personal information');
        return;
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        Alert.alert('Error', 'Date of birth must be in format YYYY-MM-DD (e.g., 1995-06-15)');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!height || !weight || !gender) {
        Alert.alert('Error', 'Please fill in all physical profile information');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!fitnessGoal) {
        Alert.alert('Error', 'Please select your fitness goal');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!password || !password2) {
        Alert.alert('Error', 'Please enter and confirm your password');
        return;
      }
      if (password !== password2) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters');
        return;
      }
      
      // Create account
      setLoading(true);
      try {
        const username = email.split('@')[0];
        await authAPI.signup({
          email,
          username,
          password,
          password2,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          height: parseFloat(height),
          weight: parseFloat(weight),
          gender,
          fitness_goal: fitnessGoal,
        });

        Alert.alert('Success!', 'Account created successfully! Logging you in...', [{ text: 'OK' }]);

        // Auto login
        const response = await authAPI.login({ email, password });
        const { access, refresh, user } = response.data;

        await AsyncStorage.multiSet([
          ['access_token', access],
          ['refresh_token', refresh],
          ['user', JSON.stringify(user)],
        ]);

        navigation.replace('MainApp');
      } catch (error) {
        console.error('Signup error:', error.response?.data);
        const message = error.response?.data?.email?.[0] ||
          error.response?.data?.username?.[0] ||
          error.response?.data?.detail ||
          'Sign up failed. Please try again.';
        Alert.alert('Sign Up Error', message);
      } finally {
        setLoading(false);
      }
    }
  };

  const passwordsMatch = password && password2 && password === password2;
  const passwordsDontMatch = password && password2 && password !== password2;

  const goals = [
    { id: 'lose_weight', icon: 'scale-bathroom', title: 'Lose Weight', desc: 'Burn fat and get lean' },
    { id: 'gain_muscle', icon: 'dumbbell', title: 'Gain Muscle', desc: 'Build strength and size' },
    { id: 'maintain', icon: 'heart-pulse', title: 'Maintain Health', desc: 'Stay fit and healthy' },
    { id: 'improve_endurance', icon: 'run-fast', title: 'Improve Endurance', desc: 'Boost stamina and energy' },
  ];

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingTop: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}
            onPress={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigation.goBack();
              }
            }}
          >
            <Icon name="arrow-left" size={24} color={colors.accent} />
            <Text style={getTypographyStyle(colors, 'bodyMedium')}>Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <AppLogo size={80} />
            <Text style={[getTypographyStyle(colors, 'h2'), { marginTop: 12 }]}>
              FitWell
            </Text>
          </View>

          <GlassCard variant="primary">
            {/* Step Indicator */}
            <Text style={[getTypographyStyle(colors, 'accent'), { textAlign: 'center', marginBottom: 8 }]}>
              Step {step} of 4
            </Text>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
                  Personal Information
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginBottom: 24 }]}>
                  Tell us about yourself
                </Text>

                <GlassInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  icon={<Icon name="account" size={20} color={colors.accent} />}
                  autoCapitalize="words"
                />

                <GlassInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  icon={<Icon name="account" size={20} color={colors.accent} />}
                  autoCapitalize="words"
                />

                <GlassInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Icon name="email" size={20} color={colors.accent} />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <GlassInput
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD (e.g., 1995-06-15)"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  icon={<Icon name="calendar" size={20} color={colors.accent} />}
                />
              </>
            )}

            {/* Step 2: Physical Profile */}
            {step === 2 && (
              <>
                <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
                  Physical Profile
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginBottom: 24 }]}>
                  Help us personalize your experience
                </Text>

                <GlassInput
                  label="Height (cm)"
                  placeholder="Enter height in cm (e.g., 175)"
                  value={height}
                  onChangeText={setHeight}
                  icon={<Icon name="human-male-height" size={20} color={colors.accent} />}
                  keyboardType="numeric"
                />

                <GlassInput
                  label="Weight (kg)"
                  placeholder="Enter weight in kg (e.g., 70)"
                  value={weight}
                  onChangeText={setWeight}
                  icon={<Icon name="weight-kilogram" size={20} color={colors.accent} />}
                  keyboardType="numeric"
                />

                <Text style={[getTypographyStyle(colors, 'label'), { marginBottom: 12 }]}>
                  Gender
                </Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                  {['male', 'female', 'other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={{
                        flex: 1,
                        backgroundColor: gender === g ? colors.accent : colors.cardGlass,
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: gender === g ? colors.accent : colors.cardBorder,
                      }}
                      onPress={() => setGender(g)}
                    >
                      <Icon
                        name={g === 'male' ? 'human-male' : g === 'female' ? 'human-female' : 'human'}
                        size={24}
                        color={gender === g ? '#FFF' : colors.accent}
                      />
                      <Text style={[
                        getTypographyStyle(colors, 'label'),
                        { color: gender === g ? '#FFF' : colors.textPrimary, marginTop: 8 }
                      ]}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Step 3: Fitness Goal */}
            {step === 3 && (
              <>
                <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
                  Fitness Goal
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginBottom: 24 }]}>
                  What do you want to achieve?
                </Text>

                {goals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={{
                      backgroundColor: fitnessGoal === goal.id ? colors.accent : colors.cardGlass,
                      borderRadius: 16,
                      padding: 20,
                      alignItems: 'center',
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: fitnessGoal === goal.id ? colors.accent : colors.cardBorder,
                    }}
                    onPress={() => setFitnessGoal(goal.id)}
                  >
                    <Icon
                      name={goal.icon}
                      size={32}
                      color={fitnessGoal === goal.id ? '#FFF' : colors.accent}
                    />
                    <Text style={[
                      getTypographyStyle(colors, 'h3'),
                      { color: fitnessGoal === goal.id ? '#FFF' : colors.textPrimary, marginTop: 12 }
                    ]}>
                      {goal.title}
                    </Text>
                    <Text style={[
                      getTypographyStyle(colors, 'body'),
                      { color: fitnessGoal === goal.id ? 'rgba(255,255,255,0.9)' : colors.textTertiary, textAlign: 'center' }
                    ]}>
                      {goal.desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Step 4: Password */}
            {step === 4 && (
              <>
                <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
                  Create Password
                </Text>
                <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginBottom: 24 }]}>
                  Secure your account
                </Text>

                <GlassInput
                  label="Password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChangeText={setPassword}
                  icon={<Icon name="lock" size={20} color={colors.accent} />}
                  secureTextEntry
                />

                <GlassInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={password2}
                  onChangeText={setPassword2}
                  icon={<Icon name="lock-check" size={20} color={colors.accent} />}
                  secureTextEntry
                />

                {password2 && (
                  <View style={{ marginTop: -8, marginBottom: 16 }}>
                    {passwordsMatch && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="check-circle" size={16} color={colors.success} />
                        <Text style={[getTypographyStyle(colors, 'caption'), { color: colors.success }]}>
                          Passwords match
                        </Text>
                      </View>
                    )}
                    {passwordsDontMatch && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="close-circle" size={16} color={colors.error} />
                        <Text style={[getTypographyStyle(colors, 'caption'), { color: colors.error }]}>
                          Passwords don't match
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}

            {/* Next/Create Button */}
            <GlassButton
              variant="primary"
              size="large"
              onPress={handleNext}
              disabled={loading}
              icon={loading ? null : <Icon name={step === 4 ? 'check' : 'arrow-right'} size={20} color="#FFF" />}
              style={{ marginTop: 8 }}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : step === 4 ? 'Create Account' : 'Next'}
            </GlassButton>

            {/* Login Link */}
            {step === 1 && (
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={getTypographyStyle(colors, 'body')}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={getTypographyStyle(colors, 'accent')}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default SignupScreen;
