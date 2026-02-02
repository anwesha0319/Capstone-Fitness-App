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

const LoginOnlyScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
        ['access_token', access],
        ['refresh_token', refresh],
        ['user', JSON.stringify(user)],
      ]);

      console.log('Tokens saved, navigating to MainApp');
      navigation.replace('MainApp');
    } catch (error) {
      console.log('=== LOGIN ERROR ===');
      console.log('Error object:', error);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error response status:', error.response?.status);
      console.log('Error config:', error.config);
      
      let message = 'Login failed. Please check your credentials.';
      
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
      
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

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
            onPress={() => navigation.goBack()}
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

            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue your fitness journey</Text>

            {/* Email Input */}
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Reset Password', 'Password reset will be available soon')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
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
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111111',
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 15,
    color: '#1A73E8',
    fontWeight: '700',
  },
});

export default LoginOnlyScreen;
