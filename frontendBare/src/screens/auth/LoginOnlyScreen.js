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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import GlassInput from '../../components/GlassInput';
import AppLogo from '../../components/AppLogo';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle } from '../../utils/styleHelpers';
import { authAPI } from '../../api/endpoints';

const LoginOnlyScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access, refresh, user } = response.data;

      await AsyncStorage.multiSet([
        ['access_token', access],
        ['refresh_token', refresh],
        ['user', JSON.stringify(user)],
      ]);

      navigation.replace('MainApp');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      let message = 'Login failed. Please check your credentials.';
      
      if (!error.response) {
        if (error.message === 'Network Error') {
          message = '❌ Cannot connect to server!\n\nPlease check:\n1. Backend is running on port 8000\n2. Both devices on same WiFi\n3. Firewall allows port 8000';
        }
      } else if (error.response?.status === 401) {
        message = '🔒 Invalid email or password.\n\nPlease check your credentials and try again.';
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }
      
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be available soon. Please contact support if you need help.',
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <GradientBackground>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 80, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <AppLogo size={100} />
              <Text style={[getTypographyStyle(colors, 'h1'), { marginTop: 20, textAlign: 'center' }]}>
                FitWell
              </Text>
              <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 8, textAlign: 'center' }]}>
                Your Fitness Journey Starts Here
              </Text>
            </View>

            <GlassCard variant="primary">
              <Text style={[getTypographyStyle(colors, 'h2'), { textAlign: 'center' }]}>
                Welcome Back!
              </Text>
              <Text style={[getTypographyStyle(colors, 'body'), { textAlign: 'center', marginBottom: 24 }]}>
                Sign in to continue your fitness journey
              </Text>

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
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                icon={<Icon name="lock" size={20} color={colors.accent} />}
                secureTextEntry
              />

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 }}
                onPress={handleForgotPassword}
              >
                <Text style={getTypographyStyle(colors, 'accent')}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <GlassButton
                variant="primary"
                size="large"
                onPress={handleLogin}
                disabled={loading}
                icon={loading ? null : <Icon name="login" size={20} color="#FFF" />}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : 'Sign In'}
              </GlassButton>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={getTypographyStyle(colors, 'body')}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={getTypographyStyle(colors, 'accent')}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </TouchableWithoutFeedback>
  );
};

export default LoginOnlyScreen;
