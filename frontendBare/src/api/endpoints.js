import apiClient from './client';

export const authAPI = {
  signup: (userData) => apiClient.post('/auth/signup/', userData),
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  getProfile: () => apiClient.get('/auth/profile/'),
  updateProfile: (data) => apiClient.patch('/auth/profile/', data),
};

export const healthAPI = {
  getHealthData: (days = 7) => apiClient.get(`/health/health-data/?days=${days}`),
  syncHealthData: (data) => apiClient.post('/health/sync/', data),
  getAnalytics: (days = 7) => apiClient.get(`/health/analytics/?days=${days}`),
  addWorkout: (workoutData) => apiClient.post('/health/workouts/', workoutData),
  getWorkouts: () => apiClient.get('/health/workouts/'),
  addSleepData: (sleepData) => apiClient.post('/health/sleep/', sleepData),
  addHeartRate: (heartRateData) => apiClient.post('/health/heart-rate/', heartRateData),
};