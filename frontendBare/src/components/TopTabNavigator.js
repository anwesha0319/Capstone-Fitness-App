import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import MyProfileScreen from '../screens/main/MyProfileScreen';
import AboutFitWellScreen from '../screens/main/AboutFitWellScreen';

const { width } = Dimensions.get('window');

const TopTabNavigator = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation();

  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Analytics', icon: 'chart-box', label: 'Statistic' },
    { name: 'My Profile', icon: 'account', label: 'Profile' },
    { name: 'About FitWell', icon: 'information', label: 'About' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Analytics':
        return <AnalyticsScreen navigation={navigation} />;
      case 'My Profile':
        return <MyProfileScreen />;
      case 'About FitWell':
        return <AboutFitWellScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.backgroundStart : colors.backgroundStart }]}>
      {/* Top Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card + '80' }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tab,
                activeTab === tab.name ? [
                  styles.tabActive,
                  { backgroundColor: colors.card, borderColor: colors.border }
                ] : styles.tabInactive
              ]}
              onPress={() => setActiveTab(tab.name)}
              activeOpacity={0.7}
            >
              <Icon
                name={tab.icon}
                size={activeTab === tab.name ? 22 : 24}
                color={activeTab === tab.name ? colors.accent : colors.textSecondary}
              />
              {activeTab === tab.name && (
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textPrimary }
                  ]}
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Theme Toggle Icon */}
          <TouchableOpacity
            style={styles.iconTabTransparent}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Icon
              name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>

          {/* Logout Icon */}
          <TouchableOpacity
            style={styles.iconTabTransparent}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={24} color={isDark ? colors.error : '#DC2626'} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  tabScrollContent: {
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    width: 48,
    height: 48,
    paddingHorizontal: 0,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  iconTab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconTabTransparent: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default TopTabNavigator;
