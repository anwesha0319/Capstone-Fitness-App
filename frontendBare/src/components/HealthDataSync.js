import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import realHealthConnectService from '../services/realHealthConnectService';
import healthConnectService from '../services/healthConnectService'; // Fallback
import { healthAPI } from '../api/endpoints';

const HealthDataSync = ({ onSyncComplete }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [useRealData, setUseRealData] = useState(true); // Toggle between real and sample

  const handleSyncPress = async () => {
    setSyncing(true);
    setSyncStatus('syncing');

    try {
      let healthData;

      if (useRealData) {
        // Try to use real Health Connect data
        console.log('Attempting to sync real Health Connect data...');
        
        const available = await realHealthConnectService.checkAvailability();
        
        if (!available) {
          Alert.alert(
            'Health Connect Unavailable',
            'Health Connect is not available. Would you like to use sample data instead?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => {
                setSyncStatus('idle');
                setSyncing(false);
              }},
              { text: 'Use Sample Data', onPress: () => {
                setUseRealData(false);
                handleSyncPress(); // Retry with sample data
              }}
            ]
          );
          return;
        }

        // Request permissions
        const hasPermissions = await realHealthConnectService.requestPermissions();
        
        if (!hasPermissions) {
          Alert.alert('Permissions Denied', 'Health Connect permissions are required to sync data.');
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 2000);
          return;
        }

        // Fetch real data
        healthData = await realHealthConnectService.fetchAllHealthData(7);
        
        // Check if we got any data
        if (healthData.health_data.length === 0) {
          Alert.alert(
            'No Data Found',
            'No health data found in Health Connect. Install fitness apps like Google Fit to collect data, or use sample data for testing.',
            [
              { text: 'Use Sample Data', onPress: () => {
                setUseRealData(false);
                handleSyncPress();
              }},
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          setSyncStatus('idle');
          setSyncing(false);
          return;
        }

        console.log('✅ Real Health Connect data fetched successfully!');
        
      } else {
        // Use sample data
        console.log('Using sample data...');
        healthData = healthConnectService.generateSampleData(7);
      }

      // Sync to backend
      console.log('Syncing to backend...');
      await healthAPI.syncHealthData(healthData);

      setSyncStatus('success');
      Alert.alert(
        'Success!',
        useRealData 
          ? 'Real health data synced successfully!'
          : 'Sample data synced successfully. Added 7 days of data.',
        [{ text: 'OK' }]
      );

      // Notify parent component
      if (onSyncComplete) {
        onSyncComplete();
      }

      // Reset status after 2 seconds
      setTimeout(() => {
        setSyncStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to sync health data. Please try again.';
      Alert.alert('Sync Failed', errorMessage);

      setTimeout(() => {
        setSyncStatus('idle');
      }, 2000);
    } finally {
      setSyncing(false);
    }
  };

  const toggleDataSource = () => {
    setUseRealData(!useRealData);
    Alert.alert(
      'Data Source Changed',
      useRealData 
        ? 'Switched to sample data mode. Good for testing without fitness apps.'
        : 'Switched to real Health Connect data. Make sure you have fitness apps installed.',
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <ActivityIndicator size={20} color="#fff" />;
      case 'success':
        return <Icon name="check-circle" size={20} color="#fff" />;
      case 'error':
        return <Icon name="alert-circle" size={20} color="#fff" />;
      default:
        return <Icon name="sync" size={20} color="#fff" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return useRealData ? 'Syncing Real Data...' : 'Syncing Sample Data...';
      case 'success':
        return 'Synced Successfully!';
      case 'error':
        return 'Sync Failed';
      default:
        return useRealData ? 'Sync Health Connect' : 'Sync Sample Data';
    }
  };

  const getButtonColor = () => {
    switch (syncStatus) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#FF3B30';
      default:
        return useRealData ? '#4CAF50' : '#2196F3';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.syncButton, { backgroundColor: getButtonColor() }]}
        onPress={handleSyncPress}
        disabled={syncing}>
        {getStatusIcon()}
        <Text style={styles.syncButtonText}>{getStatusText()}</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleDataSource}>
          <Icon 
            name={useRealData ? "cellphone-link" : "auto-fix"} 
            size={18} 
            color="#4CAF50" 
          />
          <Text style={styles.toggleButtonText}>
            {useRealData ? 'Using: Real Data' : 'Using: Sample Data'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Icon name="information" size={16} color="#666" />
        <Text style={styles.infoText}>
          {useRealData 
            ? 'Reading from Health Connect. Install Google Fit or Samsung Health to see your real fitness data.'
            : 'Using sample data for testing. Switch to real data to sync from Health Connect.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    gap: 6,
  },
  toggleButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});

export default HealthDataSync;