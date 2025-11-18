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
import { authAPI } from '../../api/endpoints';

const ProfileScreen = ({ navigation }) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatBox
          icon="calendar"
          label="Member Since"
          value={new Date(user?.created_at).toLocaleDateString('en', { 
            year: 'numeric', 
            month: 'short' 
          })}
        />
        <StatBox
          icon="target"
          label="Goal"
          value={formatGoal(user?.fitness_goal)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <MenuItem
          icon="account-edit"
          title="Edit Profile"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
        />
        <MenuItem
          icon="shield-check"
          title="Privacy & Security"
          onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon')}
        />
        <MenuItem
          icon="bell"
          title="Notifications"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
        />
        <MenuItem
          icon="cog"
          title="App Settings"
          onPress={() => Alert.alert('Coming Soon', 'App settings coming soon')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Data</Text>
        
        <MenuItem
          icon="heart-pulse"
          title="Health Connect Settings"
          onPress={() => Alert.alert('Info', 'Health Connect integration coming soon for Expo')}
        />
        <MenuItem
          icon="chart-line"
          title="Export Data"
          onPress={() => Alert.alert('Coming Soon', 'Data export will be available soon')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <MenuItem
          icon="help-circle"
          title="Help & FAQ"
          onPress={() => Alert.alert('Coming Soon', 'Help section coming soon')}
        />
        <MenuItem
          icon="information"
          title="About"
          onPress={() => Alert.alert('FitTrack', 'Version 1.0.0\n\nYour personal fitness companion')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <Icon name={icon} size={28} color="#4CAF50" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon name={icon} size={24} color="#4CAF50" />
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

const formatGoal = (goal) => {
  if (!goal) return 'Not Set';
  return goal.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;