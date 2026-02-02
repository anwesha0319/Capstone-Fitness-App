import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassButton from '../../components/GlassButton';
import AppLogo from '../../components/AppLogo';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle } from '../../utils/styleHelpers';

const WelcomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Logo Top Section */}
        <View style={styles.topSection}>
          <AppLogo size={100} />
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text style={[getTypographyStyle(colors, 'h1'), styles.appName]}>
            FitWell
          </Text>
          <Text style={[getTypographyStyle(colors, 'body'), styles.tagline]}>
            Track your progress and stay on top of your health
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Buttons at Bottom */}
        <View style={styles.buttonContainer}>
          <GlassButton
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('Signup')}
            icon={<Icon name="account-plus" size={20} color="#FFF" />}
          >
            Create Account
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="large"
            onPress={() => navigation.navigate('Login')}
            icon={<Icon name="login" size={20} color={colors.accent} />}
          >
            Log In
          </GlassButton>

          <Text style={[getTypographyStyle(colors, 'caption'), styles.footer]}>
            © 2026 FitWell. All rights reserved.
          </Text>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WelcomeScreen;
