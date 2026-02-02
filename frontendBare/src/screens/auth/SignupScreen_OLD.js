import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authAPI } from '../../api/endpoints';

const SignupScreen = ({ navigation }) => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
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
        console.error('Signup error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error message:', error.message);
        
        let message = 'Sign up failed. Please try again.';
        
        if (error.response) {
          // Server responded with error
          message = error.response?.data?.email?.[0] ||
                   error.response?.data?.username?.[0] ||
                   error.response?.data?.detail ||
                   JSON.stringify(error.response.data);
        } else if (error.request) {
          // Request was made but no response
          message = 'Cannot connect to server. Please check your internet connection.';
        } else {
          // Something else happened
          message = error.message || 'An unexpected error occurred.';
        }
        
        Alert.alert('Sign Up Error', message);
      } finally {
        setLoading(false);
      }
    }
  };

  const passwordsMatch = password && password2 && password === password2;
  const passwordsDontMatch = password && password2 && password !== password2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <Image
        source={{
          uri: 'https://i.pinimg.com/736x/5f/a9/39/5fa9397ca01734d21065ac196b26f686.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Semi-transparent Overlay */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color="#111111" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.appName}>FitWell</Text>
            </View>

            {/* Step Indicator */}
            <Text style={styles.stepIndicator}>Step {step} of 4</Text>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <Text style={styles.welcomeText}>Personal Information</Text>
                <Text style={styles.subtitleText}>Tell us about yourself</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your first name"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your last name"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD (e.g., 1995-06-15)"
                    placeholderTextColor="#999"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    returnKeyType="done"
                  />
                </View>
              </>
            )}

            {/* Step 2: Physical Profile */}
            {step === 2 && (
              <>
                <Text style={styles.welcomeText}>Physical Profile</Text>
                <Text style={styles.subtitleText}>Help us personalize your experience</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter height in cm (e.g., 175)"
                    placeholderTextColor="#999"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter weight in kg (e.g., 70)"
                    placeholderTextColor="#999"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                      onPress={() => setGender('male')}
                    >
                      <Icon name="human-male" size={24} color={gender === 'male' ? '#fff' : '#1A73E8'} />
                      <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                      onPress={() => setGender('female')}
                    >
                      <Icon name="human-female" size={24} color={gender === 'female' ? '#fff' : '#1A73E8'} />
                      <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                      onPress={() => setGender('other')}
                    >
                      <Icon name="human" size={24} color={gender === 'other' ? '#fff' : '#1A73E8'} />
                      <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Step 3: Fitness Goal */}
            {step === 3 && (
              <>
                <Text style={styles.welcomeText}>Fitness Goal</Text>
                <Text style={styles.subtitleText}>What do you want to achieve?</Text>

                <View style={styles.goalsContainer}>
                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'lose_weight' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('lose_weight')}
                  >
                    <Icon name="scale-bathroom" size={32} color={fitnessGoal === 'lose_weight' ? '#fff' : '#1A73E8'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'lose_weight' && styles.goalTitleActive]}>Lose Weight</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'lose_weight' && styles.goalDescActive]}>Burn fat and get lean</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'gain_muscle' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('gain_muscle')}
                  >
                    <Icon name="dumbbell" size={32} color={fitnessGoal === 'gain_muscle' ? '#fff' : '#1A73E8'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'gain_muscle' && styles.goalTitleActive]}>Gain Muscle</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'gain_muscle' && styles.goalDescActive]}>Build strength and size</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'maintain' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('maintain')}
                  >
                    <Icon name="heart-pulse" size={32} color={fitnessGoal === 'maintain' ? '#fff' : '#1A73E8'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'maintain' && styles.goalTitleActive]}>Maintain Health</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'maintain' && styles.goalDescActive]}>Stay fit and healthy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'improve_endurance' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('improve_endurance')}
                  >
                    <Icon name="run-fast" size={32} color={fitnessGoal === 'improve_endurance' ? '#fff' : '#1A73E8'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'improve_endurance' && styles.goalTitleActive]}>Improve Endurance</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'improve_endurance' && styles.goalDescActive]}>Boost stamina and energy</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step 4: Password */}
            {step === 4 && (
              <>
                <Text style={styles.welcomeText}>Create Password</Text>
                <Text style={styles.subtitleText}>Secure your account</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Minimum 8 characters"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#999"
                      value={password2}
                      onChangeText={setPassword2}
                      secureTextEntry={!showPassword2}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleNext}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword2(!showPassword2)}
                    >
                      <Icon name={showPassword2 ? 'eye-off' : 'eye'} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {password2 && (
                    <View style={styles.passwordMatchContainer}>
                      {passwordsMatch && (
                        <View style={styles.passwordMatch}>
                          <Icon name="check-circle" size={16} color="#10B981" />
                          <Text style={styles.passwordMatchText}>Passwords match</Text>
                        </View>
                      )}
                      {passwordsDontMatch && (
                        <View style={styles.passwordMismatch}>
                          <Icon name="close-circle" size={16} color="#EF4444" />
                          <Text style={styles.passwordMismatchText}>Passwords don't match</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Next/Create Button */}
            <TouchableOpacity
              style={[styles.nextButton, loading && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <LinearGradient
                  colors={['#1A73E8', '#4DA3FF']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextButtonText}>
                    {step === 4 ? 'Create Account' : 'Next'}
                  </Text>
                  <Icon name={step === 4 ? 'check' : 'arrow-right'} size={20} color="#fff" />
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            {step === 1 && (
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    letterSpacing: 1,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#1A73E8',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#111111',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111111',
  },
  eyeIcon: {
    padding: 16,
  },
  passwordMatchContainer: {
    marginTop: 8,
  },
  passwordMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordMatchText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  passwordMismatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordMismatchText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  genderText: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#fff',
  },
  goalsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalCardActive: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 12,
    marginBottom: 4,
  },
  goalTitleActive: {
    color: '#fff',
  },
  goalDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  goalDescActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 15,
    color: '#1A73E8',
    fontWeight: '700',
  },
});

export default SignupScreen;
