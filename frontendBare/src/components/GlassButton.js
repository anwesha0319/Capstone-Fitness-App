import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

/**
 * GlassButton Component
 * Purple gradient button for glassmorphism design
 */
const GlassButton = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  icon,
  style,
  disabled = false 
}) => {
  const { colors, isDark } = useTheme();

  const variants = {
    primary: {
      colors: colors.primaryButtonGradient,
      textColor: colors.primaryButtonText,
    },
    secondary: {
      colors: isDark 
        ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']
        : ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.3)'],
      textColor: isDark ? '#E6E9FF' : '#2B2A40',
    },
    success: {
      colors: ['#66BB6A', '#4CAF50', '#388E3C'],
      textColor: '#FFFFFF',
    },
    danger: {
      colors: ['#EF5350', '#E53935', '#C62828'],
      textColor: '#FFFFFF',
    },
  };

  const sizes = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 13,
    },
    medium: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      fontSize: 15,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 16,
    },
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.medium;

  return (
    <TouchableOpacity 
      activeOpacity={0.85} 
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={disabled ? ['#B7B4C9', '#9E9BA7'] : variantStyle.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          {
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
          },
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text 
            style={[
              styles.text,
              { 
                color: disabled ? '#FFFFFF' : variantStyle.textColor,
                fontSize: sizeStyle.fontSize,
              },
            ]}
          >
            {children}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#7C5CFA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  button: {
    borderRadius: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GlassButton;
