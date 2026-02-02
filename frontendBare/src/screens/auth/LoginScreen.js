import React, { useState } from "react";
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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authAPI } from "../../api/endpoints";

const LoginScreen = ({ navigation }) => {
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup fields - Step 1: Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // Signup fields - Step 2: Physical Profile
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  
  // Signup fields - Step 3: Fitness Goal
  const [fitnessGoal, setFitnessGoal] = useState("");
  
  // Signup fields - Step 4: Password
  const [signupPassword, setSignupPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [signupStep, setSignupStep] = useState(1);

  const handleAuth = async () => {
    if (isNewUser) {
      // Validate current step
      if (signupStep === 1) {
        if (!firstName || !lastName || !signupEmail || !dateOfBirth) {
          Alert.alert("Error", "Please fill in all personal information");
          return;
        }
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateOfBirth)) {
          Alert.alert("Error", "Date of birth must be in format YYYY-MM-DD (e.g., 1995-06-15)");
          return;
        }
        setSignupStep(2);
        return;
      }
      
      if (signupStep === 2) {
        if (!height || !weight || !gender) {
          Alert.alert("Error", "Please fill in all physical profile information");
          return;
        }
        setSignupStep(3);
        return;
      }
      
      if (signupStep === 3) {
        if (!fitnessGoal) {
          Alert.alert("Error", "Please select your fitness goal");
          return;
        }
        setSignupStep(4);
        return;
      }
      
      if (signupStep === 4) {
        if (!signupPassword || !password2) {
          Alert.alert("Error", "Please enter and confirm your password");
          return;
        }
        if (signupPassword !== password2) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        if (signupPassword.length < 8) {
          Alert.alert("Error", "Password must be at least 8 characters");
          return;
        }
        
        // All steps complete, proceed with signup
        setLoading(true);
        try {
          const username = signupEmail.split("@")[0];
          await authAPI.signup({
            email: signupEmail,
            username,
            password: signupPassword,
            password2,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            height: parseFloat(height),
            weight: parseFloat(weight),
            gender,
            fitness_goal: fitnessGoal,
          });

          Alert.alert(
            "Success!",
            "Account created successfully! Logging you in...",
            [{ text: "OK" }]
          );

          // Auto login after signup
          const response = await authAPI.login({ email: signupEmail, password: signupPassword });
          const { access, refresh, user } = response.data;

          await AsyncStorage.multiSet([
            ["access_token", access],
            ["refresh_token", refresh],
            ["user", JSON.stringify(user)],
          ]);

          navigation.replace("MainApp");
        } catch (error) {
          console.error("Signup error:", error.response?.data);
          const message = error.response?.data?.email?.[0] ||
            error.response?.data?.username?.[0] ||
            "Sign up failed. Email might already be registered.";
          Alert.alert("Sign Up Error", message);
        } finally {
          setLoading(false);
        }
      }
    } else {
      // Login validation
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      setLoading(true);
      try {
        console.log('=== LOGIN ATTEMPT START ===');
        console.log('Email:', email);
        console.log('API Base URL:', 'http://192.168.29.52:8000/api');
        console.log('Login endpoint:', '/auth/login/');
        
        const response = await authAPI.login({ email, password });
        
        console.log('=== LOGIN SUCCESS ===');
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        const { access, refresh, user } = response.data;

        await AsyncStorage.multiSet([
          ["access_token", access],
          ["refresh_token", refresh],
          ["user", JSON.stringify(user)],
        ]);

        console.log('Tokens saved, navigating to MainApp');
        navigation.replace("MainApp");
      } catch (error) {
        console.log('=== LOGIN ERROR ===');
        console.log('Error object:', error);
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        console.log('Error response:', error.response);
        console.log('Error response data:', error.response?.data);
        console.log('Error response status:', error.response?.status);
        console.log('Error config:', error.config);
        
        let message = "Login failed. Please check your credentials.";
        
        if (!error.response) {
          // Network error - no response from server
          if (error.message === 'Network Error') {
            message = "❌ Cannot connect to server!\n\n" +
                     "Please check:\n" +
                     "1. Backend is running on port 8000\n" +
                     "2. IP address: 192.168.29.52\n" +
                     "3. Both devices on same WiFi\n" +
                     "4. Firewall allows port 8000\n\n" +
                     "Try: python manage.py runserver 0.0.0.0:8000";
          } else if (error.code === 'ECONNABORTED') {
            message = "⏱️ Connection timeout!\n\nServer took too long to respond.";
          } else {
            message = `🔌 Network Error: ${error.message}\n\nCannot reach backend server.`;
          }
        } else if (error.response?.status === 401) {
          message = "🔒 Invalid email or password.\n\nPlease check your credentials and try again.";
        } else if (error.response?.status === 400) {
          message = error.response?.data?.detail || 
                   error.response?.data?.error ||
                   "❌ Bad request. Please check your input.";
        } else if (error.response?.status === 500) {
          message = "⚠️ Server error.\n\nPlease check backend console for errors.";
        } else if (error.response?.data?.detail) {
          message = error.response.data.detail;
        } else if (error.response?.data?.error) {
          message = error.response.data.error;
        }
        
        Alert.alert("Login Error", message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset functionality will be available soon. Please contact support if you need help.",
      [{ text: "OK" }]
    );
  };

  const passwordsMatch = signupPassword && password2 && signupPassword === password2;
  const passwordsDontMatch = signupPassword && password2 && signupPassword !== password2;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Half - Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(15, 23, 42, 0.8)", "#0F172A"]}
              style={styles.gradient}
            />
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>FitWell</Text>
              <Text style={styles.tagline}>
                Your Fitness Journey Starts Here
              </Text>
            </View>
          </View>

          {/* Bottom Half - Auth Form */}
          <View style={styles.formContainer}>
            {/* Toggle Buttons for Sign Up / Log In */}
            {!isNewUser || signupStep === 1 ? (
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    isNewUser && styles.toggleButtonActive,
                  ]}
                  onPress={() => {
                    setIsNewUser(true);
                    setSignupStep(1);
                  }}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isNewUser && styles.toggleTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !isNewUser && styles.toggleButtonActive,
                  ]}
                  onPress={() => setIsNewUser(false)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !isNewUser && styles.toggleTextActive,
                    ]}
                  >
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Login Form */}
            {!isNewUser && (
              <>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.subtitleText}>
                  Sign in to continue your fitness journey
                </Text>

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
                    autoComplete="email"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showLoginPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleAuth}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      <Icon name={showLoginPassword ? "eye-off" : "eye"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authButton, loading && styles.authButtonDisabled]}
                  onPress={handleAuth}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <LinearGradient
                      colors={['#1A73E8', '#4DA3FF']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.authButtonText}>Sign In</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Signup Multi-Step Form */}
            {isNewUser && signupStep === 1 && (
              <>
                <Text style={styles.stepIndicator}>Step 1 of 4</Text>
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
                    value={signupEmail}
                    onChangeText={setSignupEmail}
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

                <TouchableOpacity
                  style={styles.authButton}
                  onPress={handleAuth}
                >
                  <LinearGradient
                    colors={['#1A73E8', '#4DA3FF']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.authButtonText}>Next</Text>
                    <Icon name="arrow-right" size={20} color="#000" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Step 2: Physical Profile */}
            {isNewUser && signupStep === 2 && (
              <>
                <Text style={styles.stepIndicator}>Step 2 of 4</Text>
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
                      <Icon name="human-male" size={24} color={gender === 'male' ? '#000' : '#3B82F6'} />
                      <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                      onPress={() => setGender('female')}
                    >
                      <Icon name="human-female" size={24} color={gender === 'female' ? '#000' : '#3B82F6'} />
                      <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                      onPress={() => setGender('other')}
                    >
                      <Icon name="human" size={24} color={gender === 'other' ? '#000' : '#3B82F6'} />
                      <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.backButtonSmall}
                    onPress={() => setSignupStep(1)}
                  >
                    <Icon name="arrow-left" size={20} color="#3B82F6" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleAuth}
                  >
                    <LinearGradient
                      colors={['#1A73E8', '#4DA3FF']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.authButtonText}>Next</Text>
                      <Icon name="arrow-right" size={20} color="#000" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step 3: Fitness Goal */}
            {isNewUser && signupStep === 3 && (
              <>
                <Text style={styles.stepIndicator}>Step 3 of 4</Text>
                <Text style={styles.welcomeText}>Fitness Goal</Text>
                <Text style={styles.subtitleText}>What do you want to achieve?</Text>

                <View style={styles.goalsContainer}>
                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'lose_weight' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('lose_weight')}
                  >
                    <Icon name="scale-bathroom" size={32} color={fitnessGoal === 'lose_weight' ? '#000' : '#3B82F6'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'lose_weight' && styles.goalTitleActive]}>Lose Weight</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'lose_weight' && styles.goalDescActive]}>Burn fat and get lean</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'gain_muscle' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('gain_muscle')}
                  >
                    <Icon name="dumbbell" size={32} color={fitnessGoal === 'gain_muscle' ? '#000' : '#3B82F6'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'gain_muscle' && styles.goalTitleActive]}>Gain Muscle</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'gain_muscle' && styles.goalDescActive]}>Build strength and size</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'maintain' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('maintain')}
                  >
                    <Icon name="heart-pulse" size={32} color={fitnessGoal === 'maintain' ? '#000' : '#3B82F6'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'maintain' && styles.goalTitleActive]}>Maintain Health</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'maintain' && styles.goalDescActive]}>Stay fit and healthy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.goalCard, fitnessGoal === 'improve_endurance' && styles.goalCardActive]}
                    onPress={() => setFitnessGoal('improve_endurance')}
                  >
                    <Icon name="run-fast" size={32} color={fitnessGoal === 'improve_endurance' ? '#000' : '#3B82F6'} />
                    <Text style={[styles.goalTitle, fitnessGoal === 'improve_endurance' && styles.goalTitleActive]}>Improve Endurance</Text>
                    <Text style={[styles.goalDesc, fitnessGoal === 'improve_endurance' && styles.goalDescActive]}>Boost stamina and energy</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.backButtonSmall}
                    onPress={() => setSignupStep(2)}
                  >
                    <Icon name="arrow-left" size={20} color="#3B82F6" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleAuth}
                  >
                    <LinearGradient
                      colors={['#1A73E8', '#4DA3FF']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.authButtonText}>Next</Text>
                      <Icon name="arrow-right" size={20} color="#000" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Step 4: Password */}
            {isNewUser && signupStep === 4 && (
              <>
                <Text style={styles.stepIndicator}>Step 4 of 4</Text>
                <Text style={styles.welcomeText}>Create Password</Text>
                <Text style={styles.subtitleText}>Secure your account</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Minimum 8 characters"
                      placeholderTextColor="#999"
                      value={signupPassword}
                      onChangeText={setSignupPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#888" />
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
                      onSubmitEditing={handleAuth}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword2(!showPassword2)}
                    >
                      <Icon name={showPassword2 ? "eye-off" : "eye"} size={24} color="#888" />
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
                          <Icon name="close-circle" size={16} color="#FF3B30" />
                          <Text style={styles.passwordMismatchText}>Passwords don't match</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.backButtonSmall}
                    onPress={() => setSignupStep(3)}
                  >
                    <Icon name="arrow-left" size={20} color="#3B82F6" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.nextButton, loading && styles.authButtonDisabled]}
                    onPress={handleAuth}
                    disabled={loading}
                  >
                    {loading ? (
                      <View style={styles.buttonGradient}>
                        <ActivityIndicator color="#000" />
                      </View>
                    ) : (
                      <LinearGradient
                        colors={['#1A73E8', '#4DA3FF']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.authButtonText}>Create Account</Text>
                        <Icon name="check" size={20} color="#000" />
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Bottom spacing for keyboard */}
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    height: 250,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  logoContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 8,
    fontWeight: "300",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "transparent",
  },
  toggleText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#3B82F6",
  },
  stepIndicator: {
    fontSize: 12,
    color: "#3B82F6",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: "#888",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  genderText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#000",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
  authButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  authButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  backButtonSmall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  backButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  goalsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  goalCardActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
  },
  goalTitleActive: {
    color: "#000",
  },
  goalDesc: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  goalDescActive: {
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#fff",
  },
  eyeIcon: {
    padding: 16,
  },
  passwordMatchContainer: {
    marginTop: 8,
  },
  passwordMatch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordMatchText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  passwordMismatch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordMismatchText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "600",
  },
  bottomSpace: {
    height: 100,
  },
});

export default LoginScreen;
