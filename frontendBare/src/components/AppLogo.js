import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

/**
 * AppLogo Component
 * Displays the app logo with transparent background
 * Uses the ic_launcher from mipmap-xxxhdpi
 */
const AppLogo = ({ size = 80, style }) => {
  // Using require for local assets
  // Note: The path needs to be relative from this component
  // For Android, we'll use the asset from the res folder
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    backgroundColor: 'transparent',
  },
});

export default AppLogo;
