import React from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../context/ThemeContext';

/**
 * GlassInput Component
 * Glassmorphism text input with blur effect
 */
const GlassInput = ({ 
  value,
  onChangeText,
  placeholder,
  icon,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const InputContainer = Platform.OS === 'ios' ? BlurView : View;
  const blurProps = Platform.OS === 'ios' ? {
    blurType: isDark ? 'dark' : 'light',
    blurAmount: 50,
    reducedTransparencyFallbackColor: isDark ? 'rgba(30, 30, 50, 0.85)' : 'rgba(255, 255, 255, 0.85)',
  } : {};

  return (
    <InputContainer
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.7)',
        },
        style,
      ]}
      {...blurProps}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#B7B4C9' : '#8E8BA7'}
        style={[
          styles.input,
          { color: isDark ? '#E6E9FF' : '#2B2A40' },
        ]}
        {...props}
      />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default GlassInput;
