import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

/**
 * GradientBackground Component
 * True Glassmorphism style with pastel gradients
 * Soft, dreamy aesthetic for glass cards to sit on
 */
const GradientBackground = ({ children, style }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Main Pastel Gradient Background */}
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle overlay for depth */}
      <LinearGradient
        colors={
          isDark
            ? ['rgba(139, 92, 246, 0.1)', 'transparent', 'rgba(124, 92, 250, 0.1)']
            : ['rgba(163, 135, 250, 0.15)', 'transparent', 'rgba(124, 92, 250, 0.15)']
        }
        locations={[0, 0.5, 1]}
        style={[StyleSheet.absoluteFill, styles.overlay]}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});

export default GradientBackground;
