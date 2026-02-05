// import { Platform} from 'react-native';
// import { 
//   initialize,
//   requestPermission,
//   getSdkStatus,
//   readRecords,
//   SdkAvailabilityStatus,
// } from 'react-native-health-connect';

// const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
// const HEALTH_CONNECT_PLAYSTORE = `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PACKAGE}`;

// class RealHealthConnectService {
//   constructor() {
//     this.isInitialized = false;
//     this.permissions = [
//       { accessType: 'read', recordType: 'Steps' },
//       { accessType: 'read', recordType: 'Distance' },
//       { accessType: 'read', recordType: 'TotalCaloriesBurned' },
//       { accessType: 'read', recordType: 'HeartRate' },
//       { accessType: 'read', recordType: 'SleepSession' },
//       { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
//       { accessType: 'read', recordType: 'ExerciseSession' },
//     ];
//   }

//   async checkAvailability() {
//     try {
//       if (Platform.OS !== 'android') {
//         console.log('Health Connect is only available on Android');
//         return false;
//       }

//       const status = await getSdkStatus();
//       console.log('Health Connect SDK Status:', status);
      
//       return status === SdkAvailabilityStatus.SDK_AVAILABLE;
//     } catch (error) {
//       console.error('Health Connect availability check failed:', error);
//       return false;
//     }
//   }

//   /**
//    * Initialize Health Connect
//    */
//   async initialize() {
//     try {
//       if (this.isInitialized) {
//         return true;
//       }

//       const available = await this.checkAvailability();
//       if (!available) {
//         throw new Error('Health Connect is not available on this device');
//       }

//       const initialized = await initialize();
//       this.isInitialized = initialized;
      
//       console.log('Health Connect initialized:', initialized);
//       return initialized;
//     } catch (error) {
//       console.error('Health Connect initialization failed:', error);
//       throw error;
//     }
//   }

//   /**
//    * Request permissions from Health Connect
//    */
//   async requestPermissions() {
//     try {
//       await this.initialize();
      
//       console.log('Requesting Health Connect permissions...');
//       const granted = await requestPermission(this.permissions);
      
//       console.log('Permissions granted:', granted);
//       return granted;
//     } catch (error) {
//       console.error('Permission request failed:', error);
//       throw error;
//     }
//   }

//   /**
//    * Read steps data from Health Connect
//    */
//   async getStepsData(startDate, endDate) {
//     try {
//       console.log('Reading steps from', startDate, 'to', endDate);
      
//       const result = await readRecords('Steps', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} step records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read steps:', error);
//       return [];
//     }
//   }

//   /**
//    * Read calories data from Health Connect
//    */
//   async getCaloriesData(startDate, endDate) {
//     try {
//       const result = await readRecords('TotalCaloriesBurned', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} calorie records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read calories:', error);
//       return [];
//     }
//   }

//   /**
//    * Read distance data from Health Connect
//    */
//   async getDistanceData(startDate, endDate) {
//     try {
//       const result = await readRecords('Distance', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} distance records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read distance:', error);
//       return [];
//     }
//   }

//   /**
//    * Read heart rate data from Health Connect
//    */
//   async getHeartRateData(startDate, endDate) {
//     try {
//       const result = await readRecords('HeartRate', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} heart rate records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read heart rate:', error);
//       return [];
//     }
//   }

//   /**
//    * Read sleep data from Health Connect
//    */
//   async getSleepData(startDate, endDate) {
//     try {
//       const result = await readRecords('SleepSession', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} sleep records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read sleep:', error);
//       return [];
//     }
//   }

//   /**
//    * Read exercise sessions from Health Connect
//    */
//   async getExerciseSessions(startDate, endDate) {
//     try {
//       const result = await readRecords('ExerciseSession', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} exercise records`);
//       return result.records;
//     } catch (error) {
//       console.error('Failed to read exercise sessions:', error);
//       return [];
//     }
//   }

//   /**
//    * Aggregate steps by day
//    */
//   aggregateDailySteps(records) {
//     const dailyMap = new Map();

//     records.forEach((record) => {
//       const date = new Date(record.startTime).toISOString().split('T')[0];
      
//       if (!dailyMap.has(date)) {
//         dailyMap.set(date, 0);
//       }

//       dailyMap.set(date, dailyMap.get(date) + (record.count || 0));
//     });

//     return Array.from(dailyMap.entries()).map(([date, steps]) => ({
//       date,
//       steps,
//     }));
//   }

//   /**
//    * Aggregate calories by day
//    */
//   aggregateDailyCalories(records) {
//     const dailyMap = new Map();

//     records.forEach((record) => {
//       const date = new Date(record.startTime).toISOString().split('T')[0];
      
//       if (!dailyMap.has(date)) {
//         dailyMap.set(date, 0);
//       }

//       const calories = record.energy?.inKilocalories || 0;
//       dailyMap.set(date, dailyMap.get(date) + calories);
//     });

//     return Array.from(dailyMap.entries()).map(([date, calories]) => ({
//       date,
//       calories,
//     }));
//   }

//   /**
//    * Aggregate distance by day
//    */
//   aggregateDailyDistance(records) {
//     const dailyMap = new Map();

//     records.forEach((record) => {
//       const date = new Date(record.startTime).toISOString().split('T')[0];
      
//       if (!dailyMap.has(date)) {
//         dailyMap.set(date, 0);
//       }

//       const distance = record.distance?.inKilometers || 0;
//       dailyMap.set(date, dailyMap.get(date) + distance);
//     });

//     return Array.from(dailyMap.entries()).map(([date, distance]) => ({
//       date,
//       distance,
//     }));
//   }

//   /**
//    * Fetch all health data and format for backend
//    */
//   async fetchAllHealthData(days = 7) {
//     try {
//       console.log(`Fetching ${days} days of health data from Health Connect...`);

//       const endDate = new Date();
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - days);

//       // Fetch all data types in parallel
//       const [
//         stepsRecords,
//         caloriesRecords,
//         distanceRecords,
//         heartRateRecords,
//         sleepRecords,
//         exerciseRecords,
//       ] = await Promise.all([
//         this.getStepsData(startDate, endDate),
//         this.getCaloriesData(startDate, endDate),
//         this.getDistanceData(startDate, endDate),
//         this.getHeartRateData(startDate, endDate),
//         this.getSleepData(startDate, endDate),
//         this.getExerciseSessions(startDate, endDate),
//       ]);

//       // Aggregate daily data
//       const dailySteps = this.aggregateDailySteps(stepsRecords);
//       const dailyCalories = this.aggregateDailyCalories(caloriesRecords);
//       const dailyDistance = this.aggregateDailyDistance(distanceRecords);

//       // Merge daily data
//       const healthDataMap = new Map();

//       dailySteps.forEach(({ date, steps }) => {
//         healthDataMap.set(date, { date, steps, calories_burned: 0, distance: 0, active_minutes: 0 });
//       });

//       dailyCalories.forEach(({ date, calories }) => {
//         const existing = healthDataMap.get(date) || { date, steps: 0, calories_burned: 0, distance: 0, active_minutes: 0 };
//         existing.calories_burned = calories;
//         healthDataMap.set(date, existing);
//       });

//       dailyDistance.forEach(({ date, distance }) => {
//         const existing = healthDataMap.get(date) || { date, steps: 0, calories_burned: 0, distance: 0, active_minutes: 0 };
//         existing.distance = distance;
//         healthDataMap.set(date, existing);
//       });

//       const healthData = Array.from(healthDataMap.values());

//       // Format heart rate data
//       const heartRateData = heartRateRecords.map((record) => ({
//         timestamp: record.time,
//         heart_rate: record.samples?.[0]?.beatsPerMinute || 0,
//       }));

//       // Format sleep data
//       const sleepData = sleepRecords.map((record) => {
//         const duration = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60 * 60);
//         return {
//           date: new Date(record.startTime).toISOString().split('T')[0],
//           sleep_duration: duration,
//           sleep_quality: this.categorizeSleepQuality(duration),
//         };
//       });

//       // Format workout sessions
//       const workoutSessions = exerciseRecords.map((record) => {
//         const duration = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60);
//         return {
//           workout_type: this.mapExerciseType(record.exerciseType),
//           start_time: record.startTime,
//           end_time: record.endTime,
//           duration: Math.round(duration),
//           calories_burned: 0, // Would need separate calorie records
//           distance: record.distance?.inKilometers || null,
//           notes: record.title || '',
//         };
//       });

//       console.log('Health data fetched successfully:');
//       console.log(`- ${healthData.length} daily records`);
//       console.log(`- ${heartRateData.length} heart rate readings`);
//       console.log(`- ${sleepData.length} sleep records`);
//       console.log(`- ${workoutSessions.length} workouts`);

//       return {
//         health_data: healthData,
//         heart_rate_data: heartRateData,
//         sleep_data: sleepData,
//         workout_sessions: workoutSessions,
//       };
//     } catch (error) {
//       console.error('Failed to fetch health data:', error);
//       throw error;
//     }
//   }

//   /**
//    * Categorize sleep quality based on duration
//    */
//   categorizeSleepQuality(hours) {
//     if (hours >= 7 && hours <= 9) return 'excellent';
//     if (hours >= 6 && hours < 7) return 'good';
//     if (hours >= 5 && hours < 6) return 'fair';
//     return 'poor';
//   }

//   /**
//    * Map Health Connect exercise types to our format
//    */
//   mapExerciseType(type) {
//     const typeMap = {
//       'RUNNING': 'running',
//       'WALKING': 'walking',
//       'CYCLING': 'cycling',
//       'SWIMMING': 'swimming',
//       'YOGA': 'yoga',
//       'STRENGTH_TRAINING': 'gym',
//       'WORKOUT': 'gym',
//     };
//     return typeMap[type] || 'other';
//   }
// }

// export default new RealHealthConnectService();

// import { Platform, Linking, Alert } from 'react-native';
// import {
//   initialize,
//   requestPermission,
//   getSdkStatus,
//   readRecords,
//   SdkAvailabilityStatus,
// } from 'react-native-health-connect';

// const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
// const HEALTH_CONNECT_PLAYSTORE = `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PACKAGE}`;

// class realHealthConnectService{
//   constructor() {
//     this.isInitialized = false;
//   }

//   /**
//    * Check if Health Connect is available
//    * On Android 13, this checks if the app is installed
//    */
//   async checkAvailability() {
//     try {
//       if (Platform.OS !== 'android') {
//         console.log('Health Connect only available on Android');
//         return false;
//       }

//       console.log('Checking Health Connect availability...');
//       const status = await getSdkStatus();
//       console.log('SDK Status:', status);

//       if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
//         console.log('Health Connect app not installed');
//         return false;
//       }

//       if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
//         console.log('Health Connect needs update');
//         return false;
//       }

//       return status === SdkAvailabilityStatus.SDK_AVAILABLE;
//     } catch (error) {
//       console.error('Availability check error:', error);
//       return false;
//     }
//   }

//   /**
//    * Prompt user to install Health Connect
//    */
//   async promptInstallHealthConnect() {
//     return new Promise((resolve) => {
//       Alert.alert(
//         'Health Connect Required',
//         'Health Connect app is required to sync fitness data. Would you like to install it from Play Store?',
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//             onPress: () => resolve(false),
//           },
//           {
//             text: 'Install',
//             onPress: async () => {
//               try {
//                 await Linking.openURL(HEALTH_CONNECT_PLAYSTORE);
//                 resolve(true);
//               } catch (error) {
//                 console.error('Failed to open Play Store:', error);
//                 resolve(false);
//               }
//             },
//           },
//         ]
//       );
//     });
//   }

//   /**
//    * Initialize Health Connect SDK
//    */
//   async initialize() {
//     try {
//       console.log('Initializing Health Connect...');

//       if (this.isInitialized) {
//         console.log('Already initialized');
//         return true;
//       }

//       // Check availability first
//       const available = await this.checkAvailability();
      
//       if (!available) {
//         console.log('Health Connect not available');
        
//         // Prompt to install
//         const shouldInstall = await this.promptInstallHealthConnect();
//         if (shouldInstall) {
//           throw new Error('Please install Health Connect and try again');
//         }
        
//         throw new Error('Health Connect not available');
//       }

//       // Initialize the SDK
//       const result = await initialize();
//       console.log('Initialize result:', result);

//       this.isInitialized = result;
//       return result;
//     } catch (error) {
//       console.error('Initialize error:', error);
//       throw error;
//     }
//   }

//   /**
//    * Request permissions from Health Connect
//    */
//   async requestPermissions() {
//     try {
//       console.log('=== REQUESTING PERMISSIONS ===');

//       // Make sure initialized
//       await this.initialize();

//       // Define permissions
//       const permissions = [
//         { accessType: 'read', recordType: 'Steps' },
//         { accessType: 'read', recordType: 'Distance' },
//         { accessType: 'read', recordType: 'TotalCaloriesBurned' },
//         { accessType: 'read', recordType: 'HeartRate' },
//         { accessType: 'read', recordType: 'SleepSession' },
//         { accessType: 'read', recordType: 'ExerciseSession' },
//       ];

//       console.log('Requesting permissions:', permissions);

//       // Request permissions - this opens Health Connect app
//       const granted = await requestPermission(permissions);

//       console.log('Permission result:', granted);

//       if (!granted) {
//         throw new Error('Permissions denied by user');
//       }

//       return true;
//     } catch (error) {
//       console.error('Permission request error:', error);
      
//       // More specific error handling
//       if (error.message.includes('not initialized')) {
//         throw new Error('Health Connect not properly initialized. Please reinstall Health Connect app.');
//       }
      
//       throw error;
//     }
//   }

//   /**
//    * Read steps data
//    */
//   async readSteps(startDate, endDate) {
//     try {
//       console.log(`Reading steps from ${startDate.toISOString()} to ${endDate.toISOString()}`);

//       const result = await readRecords('Steps', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} step records`);
//       return result.records;
//     } catch (error) {
//       console.error('Read steps error:', error);
//       return [];
//     }
//   }

//   /**
//    * Read calories data
//    */
//   async readCalories(startDate, endDate) {
//     try {
//       const result = await readRecords('TotalCaloriesBurned', {
//         timeRangeFilter: {
//           operator: 'between',
//           startTime: startDate.toISOString(),
//           endTime: endDate.toISOString(),
//         },
//       });

//       console.log(`Found ${result.records.length} calorie records`);
//       return result.records;
//     } catch (error) {
//       console.error('Read calories error:', error);
//       return [];
//     }
//   }

//   /**
//    * Aggregate daily data
//    */
//   aggregateDailyData(records, type) {
//     const dailyMap = new Map();

//     records.forEach((record) => {
//       const date = new Date(record.startTime).toISOString().split('T')[0];
      
//       if (!dailyMap.has(date)) {
//         dailyMap.set(date, { date, value: 0 });
//       }

//       const current = dailyMap.get(date);
      
//       if (type === 'steps') {
//         current.value += record.count || 0;
//       } else if (type === 'calories') {
//         current.value += record.energy?.inKilocalories || 0;
//       } else if (type === 'distance') {
//         current.value += record.distance?.inKilometers || 0;
//       }
//     });

//     return Array.from(dailyMap.values());
//   }

//   /**
//    * Fetch all health data
//    */
//   async fetchAllHealthData(days = 7) {
//     try {
//       console.log('=== FETCHING HEALTH DATA ===');

//       const endDate = new Date();
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - days);

//       console.log(`Fetching ${days} days of data`);

//       // Fetch steps
//       const stepsRecords = await this.readSteps(startDate, endDate);
//       const caloriesRecords = await this.readCalories(startDate, endDate);

//       // Aggregate by day
//       const dailySteps = this.aggregateDailyData(stepsRecords, 'steps');
//       const dailyCalories = this.aggregateDailyData(caloriesRecords, 'calories');

//       console.log('Daily steps:', dailySteps);
//       console.log('Daily calories:', dailyCalories);

//       // Merge data
//       const healthDataMap = new Map();

//       dailySteps.forEach(({ date, value }) => {
//         healthDataMap.set(date, {
//           date,
//           steps: value,
//           calories_burned: 0,
//           distance: 0,
//           active_minutes: 0,
//         });
//       });

//       dailyCalories.forEach(({ date, value }) => {
//         const existing = healthDataMap.get(date) || {
//           date,
//           steps: 0,
//           calories_burned: 0,
//           distance: 0,
//           active_minutes: 0,
//         };
//         existing.calories_burned = value;
//         healthDataMap.set(date, existing);
//       });

//       const healthData = Array.from(healthDataMap.values());

//       console.log('=== FINAL DATA ===');
//       console.log(`Total days: ${healthData.length}`);

//       return {
//         health_data: healthData,
//         heart_rate_data: [],
//         sleep_data: [],
//         workout_sessions: [],
//       };
//     } catch (error) {
//       console.error('Fetch all data error:', error);
//       throw error;
//     }
//   }
// }

// export default new realHealthConnectService();


import { Platform } from 'react-native';
import { 
  initialize,
  requestPermission,
  getSdkStatus,
  readRecords,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

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
   * On Android 14+, it's built into the framework
   */
  async checkAvailability() {
    try {
      if (Platform.OS !== 'android') {
        console.log('Health Connect is only available on Android');
        return false;
      }

      const status = await getSdkStatus();
      console.log('Health Connect SDK Status:', status);
      
      // On Android 14+, status should be SDK_AVAILABLE
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        return true;
      }
      
      // Handle older Android versions or missing Health Connect
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        console.log('Health Connect not available - may need Android 14+ or Health Connect app');
        return false;
      }
      
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
        console.log('Health Connect requires update');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Health Connect availability check failed:', error);
      return false;
    }
  }

  /**
   * Initialize Health Connect
   * On Android 14+, this should work seamlessly
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('Health Connect already initialized');
        return true;
      }

      const available = await this.checkAvailability();
      if (!available) {
        throw new Error('Health Connect is not available on this device');
      }

      const initialized = await initialize();
      this.isInitialized = initialized;
      
      console.log('Health Connect initialized successfully:', initialized);
      return initialized;
    } catch (error) {
      console.error('Health Connect initialization failed:', error);
      throw error;
    }
  }

  /**
   * Request permissions from Health Connect
   * On Android 14+, this opens system Health Connect settings
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
      
      // Provide helpful error messages
      if (error.message?.includes('not initialized')) {
        throw new Error('Health Connect not properly initialized');
      }
      
      throw error;
    }
  }

  /**
   * Read steps data from Health Connect
   */
  async getStepsData(startDate, endDate) {
    try {
      console.log('Reading steps from', startDate.toISOString(), 'to', endDate.toISOString());
      
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      console.log(`Found ${result.records?.length || 0} step records`);
      return result.records || [];
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

      console.log(`Found ${result.records?.length || 0} calorie records`);
      return result.records || [];
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

      console.log(`Found ${result.records?.length || 0} distance records`);
      return result.records || [];
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

      console.log(`Found ${result.records?.length || 0} heart rate records`);
      return result.records || [];
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

      console.log(`Found ${result.records?.length || 0} sleep records`);
      return result.records || [];
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

      console.log(`Found ${result.records?.length || 0} exercise records`);
      return result.records || [];
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
        healthDataMap.set(date, { 
          date, 
          steps, 
          calories_burned: 0, 
          distance: 0, 
          active_minutes: 0 
        });
      });

      dailyCalories.forEach(({ date, calories }) => {
        const existing = healthDataMap.get(date) || { 
          date, 
          steps: 0, 
          calories_burned: 0, 
          distance: 0, 
          active_minutes: 0 
        };
        existing.calories_burned = calories;
        healthDataMap.set(date, existing);
      });

      dailyDistance.forEach(({ date, distance }) => {
        const existing = healthDataMap.get(date) || { 
          date, 
          steps: 0, 
          calories_burned: 0, 
          distance: 0, 
          active_minutes: 0 
        };
        existing.distance = distance;
        healthDataMap.set(date, existing);
      });

      const healthData = Array.from(healthDataMap.values()).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

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

      console.log('✅ Health data fetched successfully:');
      console.log(`  - ${healthData.length} daily records`);
      console.log(`  - ${heartRateData.length} heart rate readings`);
      console.log(`  - ${sleepData.length} sleep records`);

      return {
        health_data: healthData,
        heart_rate_data: heartRateData,
        sleep_data: sleepData,
      };
    } catch (error) {
      console.error('❌ Failed to fetch health data:', error);
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
   * Map Health Connect exercise types to your format
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
      'EXERCISE_SESSION': 'other',
    };
    return typeMap[type?.toUpperCase()] || 'other';
  }
}

export default new RealHealthConnectService();