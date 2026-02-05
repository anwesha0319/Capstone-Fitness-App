import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

/**
 * Health Connect Service
 * Handles all interactions with Android Health Connect
 */

// Initialize Health Connect
export const initHealthConnect = async () => {
  try {
    const isInitialized = await initialize();
    console.log('Health Connect initialized:', isInitialized);
    return isInitialized;
  } catch (error) {
    console.error('Failed to initialize Health Connect:', error);
    return false;
  }
};

// Check if Health Connect is available
export const checkHealthConnectAvailability = async () => {
  try {
    const status = await getSdkStatus();
    console.log('Health Connect SDK status:', status);
    
    const statusMessages = {
      [SdkAvailabilityStatus.SDK_AVAILABLE]: 'Health Connect is available',
      [SdkAvailabilityStatus.SDK_UNAVAILABLE]: 'Health Connect is not installed',
      [SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED]: 'Health Connect needs update',
    };
    
    return {
      available: status === SdkAvailabilityStatus.SDK_AVAILABLE,
      status,
      message: statusMessages[status] || 'Unknown status',
    };
  } catch (error) {
    console.error('Failed to check Health Connect availability:', error);
    return { 
      available: false, 
      status: null,
      message: 'Failed to check availability',
    };
  }
};

// Request all necessary permissions
export const requestHealthPermissions = async () => {
  try {
    const permissions = [
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'SleepSession' },
      { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      { accessType: 'read', recordType: 'ExerciseSession' },
      { accessType: 'read', recordType: 'Weight' },
      { accessType: 'read', recordType: 'Height' },
      { accessType: 'read', recordType: 'BloodPressure' },
    ];

    const granted = await requestPermission(permissions);
    return granted;
  } catch (error) {
    console.error('Failed to request Health Connect permissions:', error);
    throw error;
  }
};

// Get today's date range
const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
  return {
    startTime: startOfDay.toISOString(),
    endTime: endOfDay.toISOString(),
  };
};

// Get date range for last N days
const getDateRange = (days = 7) => {
  const endTime = new Date().toISOString();
  const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  
  return { startTime, endTime };
};

// Get Steps for today
export const getStepsToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const steps = await readRecords('Steps', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    const totalSteps = steps.reduce((sum, record) => sum + (record.count || 0), 0);
    return totalSteps;
  } catch (error) {
    console.error('Failed to get steps:', error);
    return 0;
  }
};

// Get Distance for today (in meters)
export const getDistanceToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const distance = await readRecords('Distance', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    const totalDistance = distance.reduce((sum, record) => {
      return sum + (record.distance?.inMeters || 0);
    }, 0);
    
    // Convert meters to kilometers
    return totalDistance / 1000;
  } catch (error) {
    console.error('Failed to get distance:', error);
    return 0;
  }
};

// Get Heart Rate for today
export const getHeartRateToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const records = await readRecords('HeartRate', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    if (records.length === 0) return 0;

    // Get all heart rate samples
    const allSamples = records.flatMap(r => r.samples || []);
    
    if (allSamples.length === 0) return 0;

    // Calculate average heart rate
    const avgHeartRate = allSamples.reduce((sum, sample) => {
      return sum + (sample.beatsPerMinute || 0);
    }, 0) / allSamples.length;

    return Math.round(avgHeartRate);
  } catch (error) {
    console.error('Failed to get heart rate:', error);
    return 0;
  }
};

// Get Calories Burned for today
export const getCaloriesToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const records = await readRecords('TotalCaloriesBurned', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    const totalCalories = records.reduce((sum, record) => {
      return sum + (record.energy?.inKilocalories || 0);
    }, 0);

    return Math.round(totalCalories);
  } catch (error) {
    console.error('Failed to get calories:', error);
    return 0;
  }
};

// Get Active Calories Burned for today
export const getActiveCaloriesToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const records = await readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    const totalCalories = records.reduce((sum, record) => {
      return sum + (record.energy?.inKilocalories || 0);
    }, 0);

    return Math.round(totalCalories);
  } catch (error) {
    console.error('Failed to get active calories:', error);
    return 0;
  }
};

// Get Sleep data for today
export const getSleepToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const records = await readRecords('SleepSession', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    if (records.length === 0) {
      return { totalHours: 0, stages: {} };
    }

    // Calculate total sleep duration
    const totalDuration = records.reduce((sum, record) => {
      const start = new Date(record.startTime);
      const end = new Date(record.endTime);
      return sum + (end - start);
    }, 0);

    const totalHours = totalDuration / (1000 * 60 * 60); // Convert ms to hours

    // Get sleep stages
    const stages = records.reduce((acc, record) => {
      if (record.stages) {
        record.stages.forEach(stage => {
          const duration = (new Date(stage.endTime) - new Date(stage.startTime)) / (1000 * 60 * 60);
          acc[stage.stage] = (acc[stage.stage] || 0) + duration;
        });
      }
      return acc;
    }, {});

    return {
      totalHours: totalHours.toFixed(1),
      stages,
      bedtime: records[0]?.startTime,
      wakeTime: records[records.length - 1]?.endTime,
    };
  } catch (error) {
    console.error('Failed to get sleep data:', error);
    return { totalHours: 0, stages: {} };
  }
};

// Get Exercise Sessions for today
export const getExerciseToday = async () => {
  try {
    const { startTime, endTime } = getTodayRange();
    
    const records = await readRecords('ExerciseSession', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    const totalDuration = records.reduce((sum, record) => {
      const start = new Date(record.startTime);
      const end = new Date(record.endTime);
      return sum + (end - start);
    }, 0);

    const totalMinutes = Math.round(totalDuration / (1000 * 60));

    return {
      totalMinutes,
      sessions: records.length,
      exercises: records.map(r => ({
        type: r.exerciseType,
        duration: Math.round((new Date(r.endTime) - new Date(r.startTime)) / (1000 * 60)),
        startTime: r.startTime,
      })),
    };
  } catch (error) {
    console.error('Failed to get exercise data:', error);
    return { totalMinutes: 0, sessions: 0, exercises: [] };
  }
};

// Get Weight (most recent)
export const getLatestWeight = async () => {
  try {
    const { startTime, endTime } = getDateRange(30); // Last 30 days
    
    const records = await readRecords('Weight', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    if (records.length === 0) return null;

    // Get most recent weight
    const latestWeight = records[records.length - 1];
    return latestWeight.weight?.inKilograms || null;
  } catch (error) {
    console.error('Failed to get weight:', error);
    return null;
  }
};

// Get Height (most recent)
export const getLatestHeight = async () => {
  try {
    const { startTime, endTime } = getDateRange(365); // Last year
    
    const records = await readRecords('Height', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    if (records.length === 0) return null;

    // Get most recent height
    const latestHeight = records[records.length - 1];
    return latestHeight.height?.inMeters ? latestHeight.height.inMeters * 100 : null; // Convert to cm
  } catch (error) {
    console.error('Failed to get height:', error);
    return null;
  }
};

// Get Blood Pressure (most recent)
export const getLatestBloodPressure = async () => {
  try {
    const { startTime, endTime } = getDateRange(7);
    
    const records = await readRecords('BloodPressure', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    if (records.length === 0) return null;

    // Get most recent BP
    const latestBP = records[records.length - 1];
    return {
      systolic: latestBP.systolic?.inMillimetersOfMercury || 0,
      diastolic: latestBP.diastolic?.inMillimetersOfMercury || 0,
      time: latestBP.time,
    };
  } catch (error) {
    console.error('Failed to get blood pressure:', error);
    return null;
  }
};

// Get all health data for today
export const getAllHealthDataToday = async () => {
  try {
    const [steps, distance, heartRate, calories, activeCalories, sleep, exercise, weight, height, bloodPressure] = await Promise.all([
      getStepsToday(),
      getDistanceToday(),
      getHeartRateToday(),
      getCaloriesToday(),
      getActiveCaloriesToday(),
      getSleepToday(),
      getExerciseToday(),
      getLatestWeight(),
      getLatestHeight(),
      getLatestBloodPressure(),
    ]);

    return {
      steps,
      distance,
      heartRate,
      calories,
      activeCalories,
      sleep,
      exercise,
      weight,
      height,
      bloodPressure,
    };
  } catch (error) {
    console.error('Failed to get all health data:', error);
    throw error;
  }
};

// Get weekly steps data
export const getWeeklySteps = async () => {
  try {
    const { startTime, endTime } = getDateRange(7);
    
    const steps = await readRecords('Steps', {
      timeRangeFilter: { operator: 'between', startTime, endTime },
    });

    // Group by day
    const dailySteps = {};
    steps.forEach(record => {
      const date = new Date(record.startTime).toLocaleDateString();
      dailySteps[date] = (dailySteps[date] || 0) + (record.count || 0);
    });

    return dailySteps;
  } catch (error) {
    console.error('Failed to get weekly steps:', error);
    return {};
  }
};
