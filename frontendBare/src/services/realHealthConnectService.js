import { Platform } from 'react-native';
import { 
  initialize,
  requestPermission,
  getSdkStatus,
  readRecords,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

/**
 * Real Health Connect Service
 * Works with actual Health Connect data from user's device
 */

class RealHealthConnectService {
  constructor() {
    this.isInitialized = false;
    this.permissions = [
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'SleepSession' },
      { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      { accessType: 'read', recordType: 'ExerciseSession' },
    ];
  }

  /**
   * Check if Health Connect is available
   */
  async checkAvailability() {
    try {
      if (Platform.OS !== 'android') {
        console.log('Health Connect is only available on Android');
        return false;
      }

      const status = await getSdkStatus();
      console.log('Health Connect SDK Status:', status);
      
      return status === SdkAvailabilityStatus.SDK_AVAILABLE;
    } catch (error) {
      console.error('Health Connect availability check failed:', error);
      return false;
    }
  }

  /**
   * Initialize Health Connect
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        return true;
      }

      const available = await this.checkAvailability();
      if (!available) {
        throw new Error('Health Connect is not available on this device');
      }

      const initialized = await initialize();
      this.isInitialized = initialized;
      
      console.log('Health Connect initialized:', initialized);
      return initialized;
    } catch (error) {
      console.error('Health Connect initialization failed:', error);
      throw error;
    }
  }

  /**
   * Request permissions from Health Connect
   */
  async requestPermissions() {
    try {
      await this.initialize();
      
      console.log('Requesting Health Connect permissions...');
      const granted = await requestPermission(this.permissions);
      
      console.log('Permissions granted:', granted);
      return granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      throw error;
    }
  }

  /**
   * Read steps data from Health Connect
   */
  async getStepsData(startDate, endDate) {
    try {
      console.log('Reading steps from', startDate, 'to', endDate);
      
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} step records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read steps:', error);
      return [];
    }
  }

  /**
   * Read calories data from Health Connect
   */
  async getCaloriesData(startDate, endDate) {
    try {
      const result = await readRecords('TotalCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} calorie records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read calories:', error);
      return [];
    }
  }

  /**
   * Read distance data from Health Connect
   */
  async getDistanceData(startDate, endDate) {
    try {
      const result = await readRecords('Distance', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} distance records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read distance:', error);
      return [];
    }
  }

  /**
   * Read heart rate data from Health Connect
   */
  async getHeartRateData(startDate, endDate) {
    try {
      const result = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} heart rate records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read heart rate:', error);
      return [];
    }
  }

  /**
   * Read sleep data from Health Connect
   */
  async getSleepData(startDate, endDate) {
    try {
      const result = await readRecords('SleepSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} sleep records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read sleep:', error);
      return [];
    }
  }

  /**
   * Read exercise sessions from Health Connect
   */
  async getExerciseSessions(startDate, endDate) {
    try {
      const result = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records.length} exercise records`);
      return result.records;
    } catch (error) {
      console.error('Failed to read exercise sessions:', error);
      return [];
    }
  }

  /**
   * Aggregate steps by day
   */
  aggregateDailySteps(records) {
    const dailyMap = new Map();

    records.forEach((record) => {
      const date = new Date(record.startTime).toISOString().split('T')[0];
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, 0);
      }

      dailyMap.set(date, dailyMap.get(date) + (record.count || 0));
    });

    return Array.from(dailyMap.entries()).map(([date, steps]) => ({
      date,
      steps,
    }));
  }

  /**
   * Aggregate calories by day
   */
  aggregateDailyCalories(records) {
    const dailyMap = new Map();

    records.forEach((record) => {
      const date = new Date(record.startTime).toISOString().split('T')[0];
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, 0);
      }

      const calories = record.energy?.inKilocalories || 0;
      dailyMap.set(date, dailyMap.get(date) + calories);
    });

    return Array.from(dailyMap.entries()).map(([date, calories]) => ({
      date,
      calories,
    }));
  }

  /**
   * Aggregate distance by day
   */
  aggregateDailyDistance(records) {
    const dailyMap = new Map();

    records.forEach((record) => {
      const date = new Date(record.startTime).toISOString().split('T')[0];
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, 0);
      }

      const distance = record.distance?.inKilometers || 0;
      dailyMap.set(date, dailyMap.get(date) + distance);
    });

    return Array.from(dailyMap.entries()).map(([date, distance]) => ({
      date,
      distance,
    }));
  }

  /**
   * Fetch all health data and format for backend
   */
  async fetchAllHealthData(days = 7) {
    try {
      console.log(`Fetching ${days} days of health data from Health Connect...`);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch all data types in parallel
      const [
        stepsRecords,
        caloriesRecords,
        distanceRecords,
        heartRateRecords,
        sleepRecords,
        exerciseRecords,
      ] = await Promise.all([
        this.getStepsData(startDate, endDate),
        this.getCaloriesData(startDate, endDate),
        this.getDistanceData(startDate, endDate),
        this.getHeartRateData(startDate, endDate),
        this.getSleepData(startDate, endDate),
        this.getExerciseSessions(startDate, endDate),
      ]);

      // Aggregate daily data
      const dailySteps = this.aggregateDailySteps(stepsRecords);
      const dailyCalories = this.aggregateDailyCalories(caloriesRecords);
      const dailyDistance = this.aggregateDailyDistance(distanceRecords);

      // Merge daily data
      const healthDataMap = new Map();

      dailySteps.forEach(({ date, steps }) => {
        healthDataMap.set(date, { date, steps, calories_burned: 0, distance: 0, active_minutes: 0 });
      });

      dailyCalories.forEach(({ date, calories }) => {
        const existing = healthDataMap.get(date) || { date, steps: 0, calories_burned: 0, distance: 0, active_minutes: 0 };
        existing.calories_burned = calories;
        healthDataMap.set(date, existing);
      });

      dailyDistance.forEach(({ date, distance }) => {
        const existing = healthDataMap.get(date) || { date, steps: 0, calories_burned: 0, distance: 0, active_minutes: 0 };
        existing.distance = distance;
        healthDataMap.set(date, existing);
      });

      const healthData = Array.from(healthDataMap.values());

      // Format heart rate data
      const heartRateData = heartRateRecords.map((record) => ({
        timestamp: record.time,
        heart_rate: record.samples?.[0]?.beatsPerMinute || 0,
      }));

      // Format sleep data
      const sleepData = sleepRecords.map((record) => {
        const duration = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60 * 60);
        return {
          date: new Date(record.startTime).toISOString().split('T')[0],
          sleep_duration: duration,
          sleep_quality: this.categorizeSleepQuality(duration),
        };
      });

      // Format workout sessions
      const workoutSessions = exerciseRecords.map((record) => {
        const duration = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60);
        return {
          workout_type: this.mapExerciseType(record.exerciseType),
          start_time: record.startTime,
          end_time: record.endTime,
          duration: Math.round(duration),
          calories_burned: 0, // Would need separate calorie records
          distance: record.distance?.inKilometers || null,
          notes: record.title || '',
        };
      });

      console.log('Health data fetched successfully:');
      console.log(`- ${healthData.length} daily records`);
      console.log(`- ${heartRateData.length} heart rate readings`);
      console.log(`- ${sleepData.length} sleep records`);
      console.log(`- ${workoutSessions.length} workouts`);

      return {
        health_data: healthData,
        heart_rate_data: heartRateData,
        sleep_data: sleepData,
        workout_sessions: workoutSessions,
      };
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      throw error;
    }
  }

  /**
   * Categorize sleep quality based on duration
   */
  categorizeSleepQuality(hours) {
    if (hours >= 7 && hours <= 9) return 'excellent';
    if (hours >= 6 && hours < 7) return 'good';
    if (hours >= 5 && hours < 6) return 'fair';
    return 'poor';
  }

  /**
   * Map Health Connect exercise types to our format
   */
  mapExerciseType(type) {
    const typeMap = {
      'RUNNING': 'running',
      'WALKING': 'walking',
      'CYCLING': 'cycling',
      'SWIMMING': 'swimming',
      'YOGA': 'yoga',
      'STRENGTH_TRAINING': 'gym',
      'WORKOUT': 'gym',
    };
    return typeMap[type] || 'other';
  }
}

export default new RealHealthConnectService();