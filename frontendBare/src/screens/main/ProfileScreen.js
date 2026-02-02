import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle, getIconContainerStyle } from '../../utils/styleHelpers';
import { authAPI } from '../../api/endpoints';

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || user.email?.charAt(0)?.toUpperCase() || 'U';
  };

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
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const formatGoal = (goal) => {
    if (!goal) return 'Not Set';
    return goal.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.accent }]}>
            <Text style={[getTypographyStyle(colors, 'h1'), { color: '#FFF', fontSize: 48 }]}>
              {getInitials()}
            </Text>
          </View>
          
          <Text style={[getTypographyStyle(colors, 'h1'), { marginTop: 20 }]}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={[getTypographyStyle(colors, 'body'), { marginTop: 6 }]}>
            {user?.email}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <GlassCard variant="primary" style={styles.statBox}>
            <View style={getIconContainerStyle(colors, 'large', `${colors.accent}20`)}>
              <Icon name="calendar" size={24} color={colors.accent} />
            </View>
            <Text style={[getTypographyStyle(colors, 'caption'), { marginTop: 12 }]}>
              Member Since
            </Text>
            <Text style={[getTypographyStyle(colors, 'bodyMedium'), { marginTop: 4 }]}>
              {new Date(user?.created_at).toLocaleDateString('en', { 
                year: 'numeric', 
                month: 'short' 
              })}
            </Text>
          </GlassCard>

          <GlassCard variant="primary" style={styles.statBox}>
            <View style={getIconContainerStyle(colors, 'large', `${colors.accent}20`)}>
              <Icon name="target" size={24} color={colors.accent} />
            </View>
            <Text style={[getTypographyStyle(colors, 'caption'), { marginTop: 12 }]}>
              Goal
            </Text>
            <Text style={[getTypographyStyle(colors, 'bodyMedium'), { marginTop: 4, textAlign: 'center' }]}>
              {formatGoal(user?.fitness_goal)}
            </Text>
          </GlassCard>
        </View>

        {/* Account Settings */}
        <Text style={[getTypographyStyle(colors, 'label'), styles.sectionTitle]}>
          ACCOUNT
        </Text>
        
        <GlassCard variant="primary" style={styles.menuSection}>
          <MenuItem
            icon="account-edit"
            title="Edit Profile"
            iconColor={colors.accent}
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <MenuItem
            icon="shield-check"
            title="Privacy & Security"
            iconColor={colors.accentLight}
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon')}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <MenuItem
            icon="bell"
            title="Notifications"
            iconColor={colors.accent}
            onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
            colors={colors}
          />
        </GlassCard>

        {/* Health Data */}
        <Text style={[getTypographyStyle(colors, 'label'), styles.sectionTitle]}>
          HEALTH DATA
        </Text>
        
        <GlassCard variant="primary" style={styles.menuSection}>
          <MenuItem
            icon="heart-pulse"
            title="Health Connect"
            iconColor={colors.iconHeart}
            onPress={() => Alert.alert('Info', 'Health Connect integration active')}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <MenuItem
            icon="chart-line"
            title="Export Data"
            iconColor={colors.success}
            onPress={() => Alert.alert('Coming Soon', 'Data export will be available soon')}
            colors={colors}
          />
        </GlassCard>

        {/* Support */}
        <Text style={[getTypographyStyle(colors, 'label'), styles.sectionTitle]}>
          SUPPORT
        </Text>
        
        <GlassCard variant="primary" style={styles.menuSection}>
          <MenuItem
            icon="help-circle"
            title="Help & FAQ"
            iconColor={colors.accent}
            onPress={() => Alert.alert('Coming Soon', 'Help section coming soon')}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <MenuItem
            icon="information"
            title="About"
            iconColor={colors.accentLight}
            onPress={() => Alert.alert('FitWell', 'Version 1.0.0\n\nYour personal fitness companion')}
            colors={colors}
          />
        </GlassCard>

        {/* Logout Button */}
        <GlassButton
          variant="primary"
          size="large"
          onPress={handleLogout}
          icon={<Icon name="logout" size={20} color="#FFF" />}
          style={styles.logoutButton}
        >
          Logout
        </GlassButton>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </GradientBackground>
  );
};

const MenuItem = ({ icon, title, iconColor, onPress, colors }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <View style={[styles.menuIconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={getTypographyStyle(colors, 'bodyMedium')}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={20} color={colors.textTertiary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  menuSection: {
    padding: 0,
    marginBottom: 30,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;