import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const DashboardHeader = ({ onMenuPress }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    loadUserData();
    updateGreeting();
    updateQuote();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Morning');
    else if (hour < 18) setGreeting('Afternoon');
    else setGreeting('Evening');
  };

  const updateQuote = () => {
    const quotes = [
      'Every workout counts!',
      'Progress, not perfection.',
      'Your health is your wealth.',
      'Stronger every day.',
      'Believe in yourself!',
      'One step at a time.',
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || user.email?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        {/* Hamburger Menu - Left */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Icon name="menu" size={28} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Profile Initials - Right */}
        <View style={[styles.profileCircle, { backgroundColor: colors.accent }]}>
          <Text style={styles.profileText}>{getInitials()}</Text>
        </View>
      </View>

      {/* Big Greeting */}
      <Text style={[styles.greeting, { color: colors.textPrimary }]}>
        Good {greeting}, {user?.first_name || 'User'}!
      </Text>

      {/* Motivational Quote */}
      <Text style={[styles.quote, { color: colors.textSecondary }]}>
        {quote}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  quote: {
    fontSize: 15,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});

export default DashboardHeader;
